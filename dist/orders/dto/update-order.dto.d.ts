import { OrderStatus } from '@prisma/client';
export declare class UpdateOrderItemDto {
    tariffId?: number;
    regionId?: number;
    area?: number;
    price?: number;
}
export declare class UpdateOrderDto {
    address?: string;
    fullName?: string;
    phone?: string;
    comment?: string;
    status?: OrderStatus;
    items?: UpdateOrderItemDto[];
}
