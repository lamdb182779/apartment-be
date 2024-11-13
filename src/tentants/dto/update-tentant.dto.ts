import { PartialType } from '@nestjs/mapped-types';
import { CreateTentantDto } from './create-tentant.dto';

export class UpdateTentantDto extends PartialType(CreateTentantDto) {}
