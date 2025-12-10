import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { TelegramUpdate } from './telegram.update';
import { GoogleSheetsModule } from 'src/google-sheets/google-sheets.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TelegramService } from './telegram.service';

const LocalSession = require('telegraf-session-local');

@Module({
  imports: [
    GoogleSheetsModule,
    PrismaModule,
    ConfigModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('BOT_TOKEN')!,
        middlewares: [
          new LocalSession({ database: 'session.json' }).middleware(),
        ],
      }),
    }),
  ],
  providers: [TelegramUpdate,TelegramService],
  exports:[TelegramService,TelegramUpdate]
  
})
export class TelegramModule {}
