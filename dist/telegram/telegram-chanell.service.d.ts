import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
export declare class TelegramServiceChanell {
    private readonly bot;
    private readonly config;
    private readonly channelId;
    constructor(bot: Telegraf, config: ConfigService);
    sendOrderListToChannel(orderList: any[]): Promise<void>;
}
