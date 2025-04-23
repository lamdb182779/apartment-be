import { PartialType } from '@nestjs/mapped-types';
import { CreateOwnerDto } from './create-owner.dto';
import { IsArray, IsEmail, IsInt, ValidateNested } from 'class-validator';

export class UpdateOwnerDto extends PartialType(CreateOwnerDto) {
}
