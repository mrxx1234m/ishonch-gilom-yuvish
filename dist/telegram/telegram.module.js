"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegram_update_1 = require("./telegram.update");
const telegram_callback_handlers_1 = require("./telegram-callback.handlers");
const google_sheets_module_1 = require("../google-sheets/google-sheets.module");
const prisma_module_1 = require("../prisma/prisma.module");
const telegram_service_1 = require("./telegram.service");
const LocalSession = require('telegraf-session-local');
let TelegramModule = class TelegramModule {
};
exports.TelegramModule = TelegramModule;
exports.TelegramModule = TelegramModule = __decorate([
    (0, common_1.Module)({
        imports: [
            google_sheets_module_1.GoogleSheetsModule,
            prisma_module_1.PrismaModule,
            config_1.ConfigModule,
            nestjs_telegraf_1.TelegrafModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    token: configService.get('BOT_TOKEN'),
                    middlewares: [
                        new LocalSession({ database: 'session.json' }).middleware(),
                    ],
                }),
            }),
        ],
        providers: [telegram_update_1.TelegramUpdate, telegram_callback_handlers_1.TelegramHandlers, telegram_service_1.TelegramService],
        exports: [telegram_service_1.TelegramService, telegram_update_1.TelegramUpdate]
    })
], TelegramModule);
//# sourceMappingURL=telegram.module.js.map