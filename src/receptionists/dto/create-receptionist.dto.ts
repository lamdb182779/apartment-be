import { IsEmail, IsNotEmpty, Matches, ValidateIf } from "class-validator";

export class CreateReceptionistDto {
    @IsNotEmpty({ message: "Tên không được để trống!" })
    name: string;

    image: string;

    @IsNotEmpty({ message: "Email không được để trống!" })
    @IsEmail({}, { message: "Email phải đúng định dạng, ví dụ: example@domain.com!" })
    email: string

    @ValidateIf((o) => o.phone !== null && o.phone !== undefined && o.phone !== '')
    @Matches(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, {
        message: "Số điện thoại không hợp lệ!",
    })
    phone: string;
}
