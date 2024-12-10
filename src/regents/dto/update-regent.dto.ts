import { PartialType } from '@nestjs/mapped-types';
import { CreateRegentDto } from './create-regent.dto';

export class UpdateRegentDto extends PartialType(CreateRegentDto) {}
