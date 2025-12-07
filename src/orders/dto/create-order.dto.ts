import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ example: 1, description: 'Tariff ID' })
  @IsNumber()
  tariffId: number;

  @ApiProperty({ example: 2, description: 'Region ID' })
  @IsNumber()
  regionId: number; // 👈 YANGILANDI

  @ApiProperty({ example: 25, description: 'Area (m²)' })
  @IsNumber()
  @Min(0)
  area: number;

  @ApiProperty({
    example: 50000,
    description: 'Calculated price for this item',
  })
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 12, description: 'User ID' })
  @IsNumber()
  userId: number;

  @ApiPropertyOptional({ example: 'Chilonzor 25' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'Azizbek' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Tezroq bering' })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiPropertyOptional({
    enum: OrderStatus,
    example: OrderStatus.PENDING,
    description: 'Order status enum',
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({
    type: [OrderItemDto],
    description: 'List of order items',
    example: [
      {
        tariffId: 1,
        regionId: 2,
        area: 25,
        price: 50000,
      },
      {
        tariffId: 2,
        regionId: 3,
        area: 10,
        price: 25000,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
