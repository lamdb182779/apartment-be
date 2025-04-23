import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
    status: "Chờ xác nhận" | "Chấp thuận" | "Từ chối" | "Đã hủy";
}
