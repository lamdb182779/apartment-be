import { IsArray, IsEmail, IsInt, IsNotEmpty, IsString, Matches, ValidateIf } from "class-validator";

export class CreateOwnerDto {
    @IsNotEmpty({ message: "Tên không được để trống!" })
    @IsString({ message: "Tên phải là một chuỗi văn bản!" })
    name: string;

    // @ValidateIf((o) => o.phone !== null && o.phone !== undefined && o.phone !== '')
    // @IsString({ message: "Địa chỉ hình ảnh phải là một chuỗi văn bản!" })
    // image: string;

    @IsNotEmpty({ message: "Email không được để trống!" })
    @IsEmail({}, { message: "Email phải đúng định dạng, ví dụ: example@domain.com!" })
    email: string;

    @ValidateIf((o) => o.phone !== null && o.phone !== undefined && o.phone !== '')
    @Matches(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, {
        message: "Số điện thoại không hợp lệ!",
    })
    phone: string;

    @IsArray()
    @IsInt({ each: true })
    apartments: number[];
}
