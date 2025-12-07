import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Delete,
} from '@nestjs/common';
import { TariffService } from './tariff.service';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { CreateTariffDto } from './dto/create-tariff.dto';

@Controller('tariffs')
export class TariffController {
  constructor(private readonly tariffService: TariffService) {}

  @Post()
  create(@Body() createTariffDto: CreateTariffDto) {
    return this.tariffService.create(createTariffDto);
  }

  @Get()
  findAll() {
    return this.tariffService.findAll();
  }

  @Get('active')
  findActive() {
    return this.tariffService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tariffService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTariffDto) {
    return this.tariffService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tariffService.remove(+id);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.tariffService.deactivate(+id);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.tariffService.activate(+id);
  }
}
