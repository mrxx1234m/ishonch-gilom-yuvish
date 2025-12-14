import { GoogleSheetsService } from 'src/google-sheets/google-sheets.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Telegraf } from 'telegraf';
import { Context } from 'telegraf';
import { TelegramServiceChanell } from './telegram-chanell.service';
export interface SessionData {
    order?: any;
    step?: string;
}
export interface MyContext extends Context {
    session?: SessionData;
}
export declare class TelegramUpdate {
    private prisma;
    private bot;
    private readonly googleSheets;
    private telegramChanellService;
    constructor(prisma: PrismaService, bot: Telegraf<Context>, googleSheets: GoogleSheetsService, telegramChanellService: TelegramServiceChanell);
    notifyUser(order: any): Promise<void>;
    start(ctx: Context): Promise<void>;
    handleContactOperator(ctx: Context): Promise<void>;
    handleMyOrders(ctx: any): Promise<any>;
    handlePrices(ctx: Context): Promise<void>;
    handleAbout(ctx: Context): Promise<void>;
    handleRegionPrices(ctx: Context & any): Promise<void>;
    handlePricesCategory(ctx: Context & any): Promise<any>;
    handleOrder(ctx: any): Promise<any>;
    onLocation(ctx: MyContext): Promise<void>;
    handleText(ctx: any): Promise<any>;
    handleCallback(ctx: any): Promise<any>;
    private saveOrder;
}
