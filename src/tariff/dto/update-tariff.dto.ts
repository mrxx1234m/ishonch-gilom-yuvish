// src/tariff/dto/update-tariff.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Services } from '@prisma/client';

class TariffRegionUpdateDto {
  @IsOptional()
  @IsNumber()
  id?: number; // mavjud TariffRegion yozuvini update qilish uchun id

  @IsOptional()
  @IsNumber()
  regionId?: number; // yangi hudud qo'shish yoki update qilish uchun Regions.id

  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerM2?: number;
}

export class UpdateTariffDto {
    

  @IsOptional()
  @IsString()
  serviceName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TariffRegionUpdateDto)
  regions?: TariffRegionUpdateDto[];
}
