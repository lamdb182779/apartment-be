
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";

export class CreateNotificationDto {
    @IsNotEmpty({ message: "Nội dung khôg được để trống!" })
    content: any[]

    @IsOptional()
    @IsString({ message: "Tiêu đề phải là một chuỗi văn bản!" })
    title: string;

    @IsOptional()
    @IsString({ message: "Mô tả phải là một chuỗi văn bản!" })
    describe: string;

    @IsArray()
    @IsInt({ each: true })
    apartments: number[];
}
