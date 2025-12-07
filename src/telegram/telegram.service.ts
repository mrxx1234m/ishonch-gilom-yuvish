import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  private bot: Telegraf;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN || '');
  }

  async notifyUser(order: any) {
    if (!order?.user?.telegramId) return;

    const total = order.items?.reduce((s, i) => s + i.price, 0);

    const message = `📢 Buyurtma statusi yangilandi!
ID: ${order.id}
Status: ${order.status}
Umumiy summa: ${total?.toLocaleString()} so‘m`;

    await this.bot.telegram.sendMessage(order.user.telegramId, message);
  }
}
