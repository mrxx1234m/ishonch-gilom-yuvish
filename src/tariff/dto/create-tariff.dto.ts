// src/tariff/dto/create-tariff.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  ValidateNested,
  ArrayMinSize,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Services } from '@prisma/client';

class TariffRegionDto {
  @ApiProperty({ description: 'Hudud ID si' })
  @IsNumber()
  regionId: number;

  @ApiProperty({ description: 'Kvadrat metr uchun narx', minimum: 0 })
  @IsNumber()
  @Min(0)
  pricePerM2: number;
}

export class CreateTariffDto {
  @ApiProperty({ description: 'Tarif nomi' })
  @IsString()
  serviceName: string;

  @ApiPropertyOptional({ description: 'Tarif tavsifi' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Tarif faolligi', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Hududlar va ularning kvadrat metr narxlari',
    type: [TariffRegionDto],
  })
  @ValidateNested({ each: true })
  @Type(() => TariffRegionDto)
  @ArrayMinSize(1, { message: 'Kamida bitta hudud kiritilishi kerak' })
  regions: TariffRegionDto[];

  @ApiPropertyOptional({description:'Type qoshisi',default:'GILAM'})
  @IsString()
  category:Services
}
