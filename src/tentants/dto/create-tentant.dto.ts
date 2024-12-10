import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateTentantDto {
    @IsNotEmpty({ message: "Tên không được để trống!" })
    name: string;

    image: string;

    @IsNotEmpty({ message: "Số căn hộ không được để trống!" })
    number: number;

    @IsNotEmpty({ message: "Email không được để trống!" })
    @IsEmail({}, { message: "Email phải đúng định dạng, ví dụ: example@domain.com!" })
    email: string

    phone: string;
}
