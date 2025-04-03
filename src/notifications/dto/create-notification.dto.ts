import { IsArray, IsInt, IsNotEmpty, IsString, ValidateIf } from "class-validator";

export class CreateNotificationDto {
    @IsNotEmpty({ message: "Nội dung khôg được để trống!" })
    content: any[]

    @ValidateIf((o) => o.phone !== null && o.phone !== undefined && o.phone !== '')
    @IsString({ message: "Tiêu đề phải là một chuỗi văn bản!" })
    title: string;

    @ValidateIf((o) => o.phone !== null && o.phone !== undefined && o.phone !== '')
    @IsString({ message: "Mô tả phải là một chuỗi văn bản!" })
    describe: string;

    @IsArray()
    @IsInt({ each: true })
    apartments: number[];
}
