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
exports.RegionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RegionsService = class RegionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const oldRegions = await this.prisma.regions.findFirst({ where: { name: data.name } });
        if (oldRegions) {
            return 'Al ready exists';
        }
        return this.prisma.regions.create({
            data,
        });
    }
    async findAll() {
        return this.prisma.regions.findMany({
            include: { tariffRegions: true },
        });
    }
    async findOne(id) {
        const region = await this.prisma.regions.findUnique({
            where: { id },
            include: { tariffRegions: true },
        });
        if (!region)
            throw new common_1.NotFoundException(`Region with id ${id} not found`);
        return region;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.regions.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.regions.delete({ where: { id } });
    }
};
exports.RegionsService = RegionsService;
exports.RegionsService = RegionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RegionsService);
//# sourceMappingURL=regions.service.js.map