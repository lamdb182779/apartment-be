import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateCommentDto {
    @IsOptional()
    @IsString({ message: "Tiêu đề phải là một chuỗi văn bản!" })
    title: string;

    @IsNotEmpty({ message: "Mô tả không được để trống!" })
    @IsString({ message: "Mô tả phải là một chuỗi văn bản!" })
    description: string;
}
