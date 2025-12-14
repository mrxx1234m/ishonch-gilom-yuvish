import { OrderService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrderController {
    private readonly service;
    constructor(service: OrderService);
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
    findOne(id: string): Promise<{
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
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
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
    remove(id: string): Promise<{
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
}
