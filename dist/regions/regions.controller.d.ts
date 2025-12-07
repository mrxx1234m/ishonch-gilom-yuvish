import { RegionsService } from './regions.service';
import CreateRegionsDto from './dto/create.dto';
import UpdateRegionsDto from './dto/update-tariff.dto';
export declare class RegionsController {
    private readonly regionsService;
    constructor(regionsService: RegionsService);
    create(createRegionsDto: CreateRegionsDto): Promise<{
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
    update(id: number, updateRegionsDto: UpdateRegionsDto): Promise<{
        id: number;
        name: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
    }>;
}
