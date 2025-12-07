"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const telegraf_1 = require("telegraf");
const telegram_service_1 = require("../telegram/telegram.service");
let OrderService = class OrderService {
    prisma;
    telegram;
    bot;
    constructor(prisma, telegram) {
        this.prisma = prisma;
        this.telegram = telegram;
        this.bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN || '');
    }
    async create(dto) {
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
    async findOne(id) {
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
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return {
            ...order,
            totalPrice: order.items.reduce((s, i) => s + i.price, 0),
        };
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.order.delete({ where: { id } });
    }
    async updateStatus(id, dto) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { user: true, items: true },
        });
        if (!order)
            throw new Error('Buyurtma topilmadi');
        const updatedOrder = await this.prisma.order.update({
            where: { id },
            data: { status: dto.status },
            include: { user: true, items: true },
        });
        await this.telegram.notifyUser(updatedOrder);
        return updatedOrder;
    }
    async emitStatusChange(order) {
        if (!order?.user?.telegramId)
            return;
        const message = this.getStatusMessage(order);
        try {
            await this.bot.telegram.sendMessage(order.user.telegramId, message);
        }
        catch (error) {
            console.error('Telegram xabar yuborilmadi:', error.message);
        }
    }
    getStatusMessage(order) {
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
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        telegram_service_1.TelegramService])
], OrderService);
//# sourceMappingURL=orders.service.js.map