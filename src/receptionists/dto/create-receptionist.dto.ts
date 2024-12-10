import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateReceptionistDto {
    @IsNotEmpty({ message: "Tên không được để trống!" })
    name: string;

    image: string;

    @IsNotEmpty({ message: "Email không được để trống!" })
    @IsEmail({}, { message: "Email phải đúng định dạng, ví dụ: example@domain.com!" })
    email: string

    phone: string;
}
