import { PartialType } from '@nestjs/mapped-types';
import { CreateTenantDto } from './create-tentant.dto';

export class UpdateTenantDto extends PartialType(CreateTenantDto) { }
