import { PartialType } from '@nestjs/mapped-types';
import { CreateVisitorDto } from './create-visitor.dto';
import { IsOptional } from 'class-validator';

export class UpdateVisitorDto extends PartialType(CreateVisitorDto) {
    @IsOptional()
    hasLeft: boolean
}
