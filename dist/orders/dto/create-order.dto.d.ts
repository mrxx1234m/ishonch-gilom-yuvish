import { OrderStatus } from '@prisma/client';
declare class OrderItemDto {
    tariffId: number;
    regionId: number;
    area: number;
    price: number;
}
export declare class CreateOrderDto {
    userId: number;
    address?: string;
    fullName?: string;
    phone?: string;
    comment?: string;
    status?: OrderStatus;
    items: OrderItemDto[];
}
export {};
