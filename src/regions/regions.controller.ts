import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegionsService } from './regions.service';
import CreateRegionsDto from './dto/create.dto';
import UpdateRegionsDto from './dto/update-tariff.dto';


@ApiTags('Regions')
@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi hudud qo‘shish' })
  @ApiResponse({ status: 201, description: 'Hudud yaratildi.' })
  create(@Body() createRegionsDto: CreateRegionsDto) {
    return this.regionsService.create(createRegionsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha hududlarni olish' })
  @ApiResponse({ status: 200, description: 'Hududlar ro‘yxati.' })
  findAll() {
    return this.regionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID bo‘yicha hududni olish' })
  @ApiResponse({ status: 200, description: 'Hudud topildi.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.regionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Hududni yangilash' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRegionsDto: UpdateRegionsDto,
  ) {
    return this.regionsService.update(id, updateRegionsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hududni o‘chirish' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.regionsService.remove(id);
  }
}
