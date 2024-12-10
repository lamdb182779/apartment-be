import { PartialType } from '@nestjs/mapped-types';
import { CreateOwnerDto } from './create-owner.dto';
import { IsArray, IsEmail, IsInt, ValidateNested } from 'class-validator';

export class UpdateOwnerDto extends PartialType(CreateOwnerDto) {
    name: string;

    image: string;

    @IsEmail({}, { message: "Email phải đúng định dạng, ví dụ: example@domain.com!" })
    email: string

    phone: string;

    @IsArray()
    @IsInt({ each: true })
    apartments: number[];
}
