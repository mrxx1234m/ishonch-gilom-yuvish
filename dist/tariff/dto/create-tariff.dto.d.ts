import { Services } from '@prisma/client';
declare class TariffRegionDto {
    regionId: number;
    pricePerM2: number;
}
export declare class CreateTariffDto {
    serviceName: string;
    description?: string;
    isActive?: boolean;
    regions: TariffRegionDto[];
    category: Services;
}
export {};
