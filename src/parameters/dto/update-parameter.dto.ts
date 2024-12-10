import { PartialType } from '@nestjs/mapped-types';
import { CreateParameterDto } from './create-parameter.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateParameterDto extends PartialType(CreateParameterDto) {
    @IsNotEmpty({ message: "Chỉ số không được để trống!" })
    value: number
}
