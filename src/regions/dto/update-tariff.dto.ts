import { PartialType } from '@nestjs/swagger';
import CreateRegionsDto from './create.dto';

export default class UpdateRegionsDto extends PartialType(CreateRegionsDto) {}
