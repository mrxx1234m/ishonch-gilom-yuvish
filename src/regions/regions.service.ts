import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateRegionsDto from './dto/create.dto';
import UpdateRegionsDto from './dto/update-tariff.dto';


@Injectable()
export class RegionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRegionsDto) {
    const oldRegions = await this.prisma.regions.findFirst({where:{name:data.name}})
    if(oldRegions){
        return 'Al ready exists'
    }
    return this.prisma.regions.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.regions.findMany({
      include: { tariffRegions: true }, // agar kerak bo'lsa
    });
  }

  async findOne(id: number) {
    const region = await this.prisma.regions.findUnique({
      where: { id },
      include: { tariffRegions: true },
    });
    if (!region) throw new NotFoundException(`Region with id ${id} not found`);
    return region;
  }

  async update(id: number, data: UpdateRegionsDto) {
    await this.findOne(id); // mavjudligini tekshirish
    return this.prisma.regions.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // mavjudligini tekshirish
    return this.prisma.regions.delete({ where: { id } });
  }
}
