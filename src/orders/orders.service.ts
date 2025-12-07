import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from '@prisma/client';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Context } from 'telegraf';
import { Telegraf } from 'telegraf';
import { TelegramUpdate } from 'src/telegram/telegram.update';
import { TelegramService } from 'src/telegram/telegram.service';

@Injectable()
export class OrderService {
  private bot: Telegraf;

  constructor(
    private prisma: PrismaService,
    private readonly telegram: TelegramService,
  ) {
    this.bot = new Telegraf(process.env.BOT_TOKEN || '');
  }

  // CREATE ORDER + ITEMS

  async create(dto: CreateOrderDto) {
    const { items, ...orderData } = dto;

    const order = await this.prisma.order.create({
      data: {
        ...orderData,
        items: {
          create: items.map((i) => ({
            area: i.area,
            price: i.price,
            tariff: {
              connect: { id: i.tariffId },
            },
            region: {
              connect: { id: i.regionId },
            },
          })),
        },
      },
      include: {
        user: true,
        items: {
          include: {
            tariff: true,
            region: true,
          },
        },
      },
    });

    return order;
  }

  // GET ALL
  async findAll() {
    const orders = await this.prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        items: {
          include: {
            tariff: true,
          },
        },
      },
    });

    return orders.map((o) => ({
      ...o,
      totalPrice: o.items.reduce((s, i) => s + i.price, 0),
    }));
  }

  // GET ONE
  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: {
            tariff: true,
          },
        },
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    return {
      ...order,
      totalPrice: order.items.reduce((s, i) => s + i.price, 0),
    };
  }

  async remove(id: number) {
    await this.findOne(id); // mavjudligini tekshirish
    return this.prisma.order.delete({ where: { id } });
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { user: true, items: true },
    });

    if (!order) throw new Error('Buyurtma topilmadi');

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: { user: true, items: true },
    });

    // Telegram xabarini yuborish
    await this.telegram.notifyUser(updatedOrder); // <--- shu o'zgardi

    return updatedOrder;
  }

  // TELEGRAM XABARINI YUBORISH
  async emitStatusChange(order: any) {
    if (!order?.user?.telegramId) return;

    const message = this.getStatusMessage(order);

    try {
      await this.bot.telegram.sendMessage(order.user.telegramId, message);
    } catch (error) {
      console.error('Telegram xabar yuborilmadi:', error.message);
    }
  }

  // STATUS BO'YICHA XABAR
  getStatusMessage(order: any) {
    const total = order.items?.reduce((sum, item) => sum + item.price, 0);

    switch (order.status) {
      case 'PENDING':
        return `📦 Buyurtmangiz qabul qilindi!\nBuyurma id: ${order.id}`;

      case 'PROCESSING':
        return `🛠 Buyurtmangiz ishlanmoqda!\nBuyurtma id: ${order.id}\nUmumiy summa: ${total?.toLocaleString()} so‘m`;

      case 'DONE':
        return `✅ Buyurtmangiz bajarildi!\nBuyurma id: ${order.id}\nUmumiy summa: ${total?.toLocaleString()} so‘m\nRahmat!`;

      case 'CANCELLED':
        return `❌ Buyurtmangiz bekor qilindi.\nBuyurma id: ${order.id}`;

      default:
        return `ℹ️ Buyurtma holati yangilandi.\nBuyurma id: ${order.id}`;
    }
  }
}
