import { Type } from "class-transformer";
import { IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateVehicleDto {
    @IsOptional()
    @IsString({ message: "Biển xe phải là một chuỗi văn bản!" })
    name: string;

    @IsNotEmpty({ message: "Hình ảnh không được để trống!" })
    @IsString({ message: "Địa chỉ hình ảnh phải là một chuỗi văn bản!" })
    image: string;

    @IsNotEmpty({ message: "Loại xe không được để trống!" })
    @IsString({ message: "Loại xe phải là một chuỗi văn bản!" })
    type: "Xe đạp" | "Xe máy" | "Ô tô" | "Khác";

    @IsNotEmpty({ message: "Hãng xe không được để trống!" })
    @IsString({ message: "Hãng xe phải là một chuỗi văn bản!" })
    brand: string;

    @IsNotEmpty({ message: "Mã số chủ xe không được để trống!" })
    @IsUUID(undefined, { message: "Mã số chủ xe không đúng định dạng uuid!" })
    ownerId: string

    @IsNotEmpty({ message: "Mã vai trò không được để trống!" })
    @Type(() => Number)
    @IsIn([31, 32], {
        message: "Vai trò cần là 1 trong hai giá trị 31 hoặc 32!",
    })
    roleId: number

}
