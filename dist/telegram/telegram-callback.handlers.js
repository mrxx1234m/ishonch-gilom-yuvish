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
exports.TelegramHandlers = void 0;
const common_1 = require("@nestjs/common");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
let TelegramHandlers = class TelegramHandlers {
    async handlePrices(ctx) {
        await ctx.answerCbQuery();
        const prices = [
            { serviceName: 'Gilam yuvish', pricePerM2: 50000 },
            { serviceName: 'Kreslo yuvish', pricePerM2: 30000 },
        ];
        let message = 'Narxlar ro‘yxati:\n';
        prices.forEach((p) => {
            message += `${p.serviceName}: ${p.pricePerM2} so‘m/m²\n`;
        });
        await ctx.reply(message);
    }
};
exports.TelegramHandlers = TelegramHandlers;
__decorate([
    (0, nestjs_telegraf_1.Action)('prices'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramHandlers.prototype, "handlePrices", null);
exports.TelegramHandlers = TelegramHandlers = __decorate([
    (0, common_1.Injectable)()
], TelegramHandlers);
//# sourceMappingURL=telegram-callback.handlers.js.map