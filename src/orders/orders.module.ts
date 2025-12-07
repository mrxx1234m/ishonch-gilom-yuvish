import { Module } from '@nestjs/common';
import { OrderController } from './orders.controller';
import { OrderService } from './orders.service';
import { TelegramModule } from 'src/telegram/telegram.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [TelegramModule],
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
  exports:[OrderService]
})
export class OrdersModule {}
