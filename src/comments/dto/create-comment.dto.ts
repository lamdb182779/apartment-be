import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateCommentDto {
    @IsNotEmpty({ message: "Tiêu đề không được để trống!" })
    @IsString({ message: "Tiêu đề phải là một chuỗi văn bản!" })
    title: string;

    @IsNotEmpty({ message: "Mô tả không được để trống!" })
    @IsString({ message: "Mô tả phải là một chuỗi văn bản!" })
    description: string;

    @IsOptional()
    @IsString({ message: "Địa chỉ hình ảnh phải là một chuỗi văn bản!" })
    image: string;
}
