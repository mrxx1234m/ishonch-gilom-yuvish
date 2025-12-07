import { OrderService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrderController {
    private readonly service;
    constructor(service: OrderService);
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
    findOne(id: string): Promise<{
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
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
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
    remove(id: string): Promise<{
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
}
