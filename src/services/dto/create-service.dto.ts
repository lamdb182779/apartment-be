
import { IsInt, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";

export class CreateServiceDto {

    @IsNotEmpty({ message: "Loại yêu cầu không được để trống!" })
    @IsString({ message: "Loại yêu cầu phải là một chuỗi văn bản!" })
    type: string;

    @IsNotEmpty({ message: "Ngày bắt đầu không được để trống!" })
    startDate: Date;

    @IsNotEmpty({ message: "Ngày kết thúc không được để trống!" })
    endDate: Date;

    @IsNotEmpty({ message: "Khu vực không được để trống!" })
    @IsString({ message: "Khu vực phải là một chuỗi văn bản!" })
    area: string;

    @IsOptional()
    @IsString({ message: "Mô tả phải là một chuỗi văn bản!" })
    reason: string;

    @IsNotEmpty({ message: "Số căn hộ không được để trống!" })
    @IsInt({ message: "Số căn hộ phải là số nguyên!" })
    number: number
}
