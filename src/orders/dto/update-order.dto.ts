import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderItemDto {
  @ApiPropertyOptional({ example: 1, description: 'Tariff ID' })
  @IsNumber()
  @IsOptional()
  tariffId?: number;

  @ApiPropertyOptional({ example: 2, description: 'Region ID' })
  @IsNumber()
  @IsOptional()
  regionId?: number;

  @ApiPropertyOptional({ example: 25, description: 'Area (m²)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  area?: number;

  @ApiPropertyOptional({
    example: 50000,
    description: 'Calculated price for this item',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;
}

export class UpdateOrderDto {
  @ApiPropertyOptional({ example: 'Chilonzor 25', description: 'User address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    example: 'Azizbek',
    description: 'Full name of the user',
  })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({
    example: '+998901234567',
    description: 'Phone number of the user',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    example: 'Tezroq bering',
    description: 'Additional comment',
  })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiPropertyOptional({
    enum: OrderStatus,
    example: OrderStatus.PENDING,
    description: 'Order status',
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiPropertyOptional({
    type: [UpdateOrderItemDto],
    description: 'List of order items to update',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  @IsOptional()
  items?: UpdateOrderItemDto[];
}
