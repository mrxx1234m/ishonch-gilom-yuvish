import { PrismaService } from 'src/prisma/prisma.service';
import CreateRegionsDto from './dto/create.dto';
import UpdateRegionsDto from './dto/update-tariff.dto';
export declare class RegionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateRegionsDto): Promise<{
        id: number;
        name: string;
    } | "Al ready exists">;
    findAll(): Promise<({
        tariffRegions: {
            id: number;
            regionId: number;
            tariffId: number;
            pricePerM2: number;
        }[];
    } & {
        id: number;
        name: string;
    })[]>;
    findOne(id: number): Promise<{
        tariffRegions: {
            id: number;
            regionId: number;
            tariffId: number;
            pricePerM2: number;
        }[];
    } & {
        id: number;
        name: string;
    }>;
    update(id: number, data: UpdateRegionsDto): Promise<{
        id: number;
        name: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
    }>;
}
