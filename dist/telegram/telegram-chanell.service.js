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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramServiceChanell = void 0;
const common_1 = require("@nestjs/common");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const config_1 = require("@nestjs/config");
let TelegramServiceChanell = class TelegramServiceChanell {
    bot;
    config;
    channelId;
    constructor(bot, config) {
        this.bot = bot;
        this.config = config;
        this.channelId = Number(this.config.get('TELEGRAM_CHANNEL_ID'));
    }
    async sendOrderListToChannel(orderList) {
        const [fullName, phone, address, category, serviceName, quantity, totalPrice, date,] = orderList;
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
};
exports.TelegramServiceChanell = TelegramServiceChanell;
exports.TelegramServiceChanell = TelegramServiceChanell = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_telegraf_1.InjectBot)()),
    __metadata("design:paramtypes", [telegraf_1.Telegraf,
        config_1.ConfigService])
], TelegramServiceChanell);
//# sourceMappingURL=telegram-chanell.service.js.map