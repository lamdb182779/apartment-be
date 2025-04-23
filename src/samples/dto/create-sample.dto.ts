
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSampleDto {
    @IsNotEmpty({ message: "Tên không được để trống!" })
    @IsString({ message: "Tên phải là một chuỗi văn bản!" })
    name: string;

    @IsOptional()
    @IsString({ message: "Mô tả phải là một chuỗi văn bản!" })
    describe: string;
}
