import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class CreateRegionsDto {
  @ApiProperty({ example: 'Toshkent', description: 'Hudud nomi' })
  @IsString()
  name: string;
}
