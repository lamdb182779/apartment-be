import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';
import { IsIn, IsOptional } from 'class-validator';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
    @IsOptional()
    @IsIn(["Chờ xác nhận", "Chấp thuận", "Từ chối", "Đã hủy"])
    status: "Chờ xác nhận" | "Chấp thuận" | "Từ chối" | "Đã hủy";
}
