import { IsArray, IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateTaskDto {

    @IsNotEmpty({ message: "Tiêu đề không được để trống!" })
    @IsString({ message: "Tiêu đề phải là một chuỗi văn bản!" })
    title: string;

    @IsNotEmpty({ message: "Nội dung không được để trống!" })
    @IsString({ message: "Nội dung phải là một chuỗi văn bản!" })
    description: string;

    @IsNotEmpty({ message: "Thời hạn hoàn thành không được để trống!" })
    deadline: Date;

    @IsArray({ message: "Danh sách nhân viên phải là 1 mảng!" })
    users: any[];
}
