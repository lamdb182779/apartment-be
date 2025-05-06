import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateVisitorDto {
    @IsNotEmpty({ message: "Tên không được để trống!" })
    @IsString({ message: "Tên phải là một chuỗi văn bản!" })
    name: string;

    @IsNotEmpty({ message: "Số căn hộ không được để trống!" })
    @IsInt({ message: "Số căn hộ phải là số nguyên!" })
    number: number;
}
