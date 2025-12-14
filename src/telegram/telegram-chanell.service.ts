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
🛒 <b>Yangi buyurtma</b>

👤 Ism: <b>${fullName}</b>
📞 Telefon: <b>${phone}</b>
📍 Manzil: ${address}
📦 Kategoriya: ${category}
🧹 Xizmat: ${serviceName}
🔢 Miqdor: ${quantity}
💰 Narx: <b>${totalPrice} so‘m</b>
🕒 Sana: ${date}
`;

    await this.bot.telegram.sendMessage(this.channelId, text, {
      parse_mode: 'HTML',
    });
  }
}
