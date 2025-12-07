declare class TariffRegionUpdateDto {
    id?: number;
    regionId?: number;
    pricePerM2?: number;
}
export declare class UpdateTariffDto {
    serviceName?: string;
    description?: string;
    isActive?: boolean;
    regions?: TariffRegionUpdateDto[];
}
export {};
