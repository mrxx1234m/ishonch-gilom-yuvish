import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';

@Injectable()
export class TariffService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(createTariffDto: CreateTariffDto) {
    return this.prisma.tariff.create({
      data: {
        serviceName: createTariffDto.serviceName,
        description: createTariffDto.description,
        isActive: createTariffDto.isActive ?? true,
        category:createTariffDto.category,
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

  // GET ALL
  async findAll() {
    return this.prisma.tariff.findMany({
      include: { regions: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // GET ONE
  async findOne(id: number) {
    const tariff = await this.prisma.tariff.findUnique({
      where: { id },
      include: { regions: true },
    });

    if (!tariff) throw new NotFoundException('Tariff not found');

    return tariff;
  }

  // UPDATE
  async update(id: number, updateTariffDto: UpdateTariffDto) {
    await this.findOne(id);

    const data: any = {};
    if (updateTariffDto.serviceName !== undefined)
      data.serviceName = updateTariffDto.serviceName;
    if (updateTariffDto.description !== undefined)
      data.description = updateTariffDto.description;
    if (updateTariffDto.isActive !== undefined)
      data.isActive = updateTariffDto.isActive;

    if (updateTariffDto.regions && updateTariffDto.regions.length) {
      data.regions = {
        upsert: updateTariffDto.regions.map((r) => ({
          where: { id: r.id ?? 0 }, // id bo'lmasa create qilinadi
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

  // DELETE (hard delete)
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.tariff.delete({ where: { id } });
  }

  // DEACTIVATE
  async deactivate(id: number) {
    await this.findOne(id);
    return this.prisma.tariff.update({
      where: { id },
      data: { isActive: false },
      include: { regions: true },
    });
  }

  // ACTIVATE
  async activate(id: number) {
    await this.findOne(id);
    return this.prisma.tariff.update({
      where: { id },
      data: { isActive: true },
      include: { regions: true },
    });
  }

  // GET ONLY ACTIVE
  async findActive() {
    return this.prisma.tariff.findMany({
      where: { isActive: true },
      include: { regions: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
