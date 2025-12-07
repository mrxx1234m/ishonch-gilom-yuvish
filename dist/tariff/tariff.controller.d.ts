import { TariffService } from './tariff.service';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { CreateTariffDto } from './dto/create-tariff.dto';
export declare class TariffController {
    private readonly tariffService;
    constructor(tariffService: TariffService);
    create(createTariffDto: CreateTariffDto): Promise<{
        regions: {
            id: number;
            regionId: number;
            tariffId: number;
            pricePerM2: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        serviceName: string;
        description: string | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.Services;
    }>;
    findAll(): Promise<({
        regions: {
            id: number;
            regionId: number;
            tariffId: number;
            pricePerM2: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        serviceName: string;
        description: string | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.Services;
    })[]>;
    findActive(): Promise<({
        regions: {
            id: number;
            regionId: number;
            tariffId: number;
            pricePerM2: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        serviceName: string;
        description: string | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.Services;
    })[]>;
    findOne(id: string): Promise<{
        regions: {
            id: number;
            regionId: number;
            tariffId: number;
            pricePerM2: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        serviceName: string;
        description: string | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.Services;
    }>;
    update(id: string, dto: UpdateTariffDto): Promise<{
        regions: {
            id: number;
            regionId: number;
            tariffId: number;
            pricePerM2: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        serviceName: string;
        description: string | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.Services;
    }>;
    remove(id: string): Promise<{
        id: number;
        createdAt: Date;
        serviceName: string;
        description: string | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.Services;
    }>;
    deactivate(id: string): Promise<{
        regions: {
            id: number;
            regionId: number;
            tariffId: number;
            pricePerM2: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        serviceName: string;
        description: string | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.Services;
    }>;
    activate(id: string): Promise<{
        regions: {
            id: number;
            regionId: number;
            tariffId: number;
            pricePerM2: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        serviceName: string;
        description: string | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.Services;
    }>;
}
