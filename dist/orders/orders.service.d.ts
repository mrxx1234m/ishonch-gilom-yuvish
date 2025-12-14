import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { TelegramService } from 'src/telegram/telegram.service';
export declare class OrderService {
    private prisma;
    private readonly telegram;
    private bot;
    constructor(prisma: PrismaService, telegram: TelegramService);
    create(dto: CreateOrderDto): Promise<{
        user: {
            id: number;
            fullName: string | null;
            phone: string | null;
            telegramId: string;
            createdAt: Date;
        } | null;
        items: ({
            tariff: {
                id: number;
                createdAt: Date;
                serviceName: string;
                description: string | null;
                isActive: boolean;
                category: import(".prisma/client").$Enums.Services;
            };
            region: {
                id: number;
                name: string;
            };
        } & {
            id: number;
            regionId: number;
            area: number;
            price: number;
            tariffId: number;
            orderId: number;
        })[];
    } & {
        id: number;
        userId: number | null;
        address: string | null;
        fullName: string | null;
        phone: string | null;
        comment: string | null;
        telegramId: string | null;
        regionId: number | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        totalPrice: number;
        user: {
            id: number;
            fullName: string | null;
            phone: string | null;
            telegramId: string;
            createdAt: Date;
        } | null;
        items: ({
            tariff: {
                id: number;
                createdAt: Date;
                serviceName: string;
                description: string | null;
                isActive: boolean;
                category: import(".prisma/client").$Enums.Services;
            };
        } & {
            id: number;
            regionId: number;
            area: number;
            price: number;
            tariffId: number;
            orderId: number;
        })[];
        id: number;
        userId: number | null;
        address: string | null;
        fullName: string | null;
        phone: string | null;
        comment: string | null;
        telegramId: string | null;
        regionId: number | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        totalPrice: number;
        user: {
            id: number;
            fullName: string | null;
            phone: string | null;
            telegramId: string;
            createdAt: Date;
        } | null;
        items: ({
            tariff: {
                id: number;
                createdAt: Date;
                serviceName: string;
                description: string | null;
                isActive: boolean;
                category: import(".prisma/client").$Enums.Services;
            };
        } & {
            id: number;
            regionId: number;
            area: number;
            price: number;
            tariffId: number;
            orderId: number;
        })[];
        id: number;
        userId: number | null;
        address: string | null;
        fullName: string | null;
        phone: string | null;
        comment: string | null;
        telegramId: string | null;
        regionId: number | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        userId: number | null;
        address: string | null;
        fullName: string | null;
        phone: string | null;
        comment: string | null;
        telegramId: string | null;
        regionId: number | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
    }>;
    updateStatus(id: number, dto: UpdateOrderStatusDto): Promise<{
        user: {
            id: number;
            fullName: string | null;
            phone: string | null;
            telegramId: string;
            createdAt: Date;
        } | null;
        items: {
            id: number;
            regionId: number;
            area: number;
            price: number;
            tariffId: number;
            orderId: number;
        }[];
    } & {
        id: number;
        userId: number | null;
        address: string | null;
        fullName: string | null;
        phone: string | null;
        comment: string | null;
        telegramId: string | null;
        regionId: number | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
    }>;
    emitStatusChange(order: any): Promise<void>;
    getStatusMessage(order: any): string;
}
