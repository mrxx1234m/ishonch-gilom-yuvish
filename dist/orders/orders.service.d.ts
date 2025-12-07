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
            telegramId: string;
            phone: string | null;
            fullName: string | null;
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
            orderId: number;
            tariffId: number;
            area: number;
            price: number;
        })[];
    } & {
        id: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        phone: string | null;
        fullName: string | null;
        createdAt: Date;
        userId: number | null;
        address: string | null;
        comment: string | null;
        regionId: number | null;
    }>;
    findAll(): Promise<{
        totalPrice: number;
        user: {
            id: number;
            telegramId: string;
            phone: string | null;
            fullName: string | null;
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
            orderId: number;
            tariffId: number;
            area: number;
            price: number;
        })[];
        id: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        phone: string | null;
        fullName: string | null;
        createdAt: Date;
        userId: number | null;
        address: string | null;
        comment: string | null;
        regionId: number | null;
    }[]>;
    findOne(id: number): Promise<{
        totalPrice: number;
        user: {
            id: number;
            telegramId: string;
            phone: string | null;
            fullName: string | null;
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
            orderId: number;
            tariffId: number;
            area: number;
            price: number;
        })[];
        id: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        phone: string | null;
        fullName: string | null;
        createdAt: Date;
        userId: number | null;
        address: string | null;
        comment: string | null;
        regionId: number | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        phone: string | null;
        fullName: string | null;
        createdAt: Date;
        userId: number | null;
        address: string | null;
        comment: string | null;
        regionId: number | null;
    }>;
    updateStatus(id: number, dto: UpdateOrderStatusDto): Promise<{
        user: {
            id: number;
            telegramId: string;
            phone: string | null;
            fullName: string | null;
            createdAt: Date;
        } | null;
        items: {
            id: number;
            regionId: number;
            orderId: number;
            tariffId: number;
            area: number;
            price: number;
        }[];
    } & {
        id: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        phone: string | null;
        fullName: string | null;
        createdAt: Date;
        userId: number | null;
        address: string | null;
        comment: string | null;
        regionId: number | null;
    }>;
    emitStatusChange(order: any): Promise<void>;
    getStatusMessage(order: any): string;
}
