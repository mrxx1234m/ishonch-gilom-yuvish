import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramServiceChanell {
  private readonly channelId: number;

  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly config: ConfigService,
  ) {
    this.channelId = Number(this.config.get('TELEGRAM_CHANNEL_ID'));
  }

  
  async sendOrderListToChannel(orderList: any[]) {
    const [
      fullName,
      phone,
      address,
      category,
      serviceName,
      quantity,
      totalPrice,
      date,
    ] = orderList;

    const text = `
🛒 *Yangi buyurtma*

👤 Ism: *${fullName}*
📞 Telefon: *${phone}*
📍 Manzil: ${address}
📦 Kategoriya: ${category}
🧹 Xizmat: ${serviceName}
🔢 Miqdor: ${quantity}
💰 Narx: *${totalPrice} so‘m*
🕒 Sana: ${date}
`;

    await this.bot.telegram.sendMessage(this.channelId, text, {
      parse_mode: 'Markdown',
    });
  }
}
