"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TariffService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TariffService = class TariffService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTariffDto) {
        return this.prisma.tariff.create({
            data: {
                serviceName: createTariffDto.serviceName,
                description: createTariffDto.description,
                isActive: createTariffDto.isActive ?? true,
                category: createTariffDto.category,
                regions: {
                    create: createTariffDto.regions.map((r) => ({
                        regionId: r.regionId,
                        pricePerM2: r.pricePerM2,
                    })),
                },
            },
            include: { regions: true },
        });
    }
    async findAll() {
        return this.prisma.tariff.findMany({
            include: { regions: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const tariff = await this.prisma.tariff.findUnique({
            where: { id },
            include: { regions: true },
        });
        if (!tariff)
            throw new common_1.NotFoundException('Tariff not found');
        return tariff;
    }
    async update(id, updateTariffDto) {
        await this.findOne(id);
        const data = {};
        if (updateTariffDto.serviceName !== undefined)
            data.serviceName = updateTariffDto.serviceName;
        if (updateTariffDto.description !== undefined)
            data.description = updateTariffDto.description;
        if (updateTariffDto.isActive !== undefined)
            data.isActive = updateTariffDto.isActive;
        if (updateTariffDto.regions && updateTariffDto.regions.length) {
            data.regions = {
                upsert: updateTariffDto.regions.map((r) => ({
                    where: { id: r.id ?? 0 },
                    update: {
                        regionId: r.regionId,
                        pricePerM2: r.pricePerM2,
                    },
                    create: {
                        regionId: r.regionId,
                        pricePerM2: r.pricePerM2,
                    },
                })),
            };
        }
        return this.prisma.tariff.update({
            where: { id },
            data,
            include: { regions: true },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.tariff.delete({ where: { id } });
    }
    async deactivate(id) {
        await this.findOne(id);
        return this.prisma.tariff.update({
            where: { id },
            data: { isActive: false },
            include: { regions: true },
        });
    }
    async activate(id) {
        await this.findOne(id);
        return this.prisma.tariff.update({
            where: { id },
            data: { isActive: true },
            include: { regions: true },
        });
    }
    async findActive() {
        return this.prisma.tariff.findMany({
            where: { isActive: true },
            include: { regions: true },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.TariffService = TariffService;
exports.TariffService = TariffService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TariffService);
//# sourceMappingURL=tariff.service.js.map