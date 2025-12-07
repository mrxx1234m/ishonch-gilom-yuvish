import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { TelegramModule } from './telegram/telegram.module';
import { TariffModule } from './tariff/tariff.module';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { GoogleModule } from './google/google.module';
import { GoogleSheetsModule } from './google-sheets/google-sheets.module';
import { RegionsModule } from './regions/regions.module';

@Module({
  imports: [
    PrismaModule,
    TelegramModule,
    TariffModule,
    ConfigModule.forRoot({ isGlobal: true }),
    OrdersModule,
    GoogleModule,
    GoogleSheetsModule,
    RegionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
