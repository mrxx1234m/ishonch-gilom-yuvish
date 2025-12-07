import { PrismaService } from '../prisma/prisma.service';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
export declare class TariffService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findOne(id: number): Promise<{
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
    update(id: number, updateTariffDto: UpdateTariffDto): Promise<{
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
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        serviceName: string;
        description: string | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.Services;
    }>;
    deactivate(id: number): Promise<{
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
    activate(id: number): Promise<{
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
}
