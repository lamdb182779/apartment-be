import { IsInt, IsNotEmpty, IsNumber, IsString, IsUUID, ValidateIf } from "class-validator";

export class CreateBillDto {
    @IsNotEmpty({ message: "Nội dung khôg được để trống!" })
    content: any[]

    @IsNotEmpty({ message: "Số tiền hóa đơn không được để trống!" })
    @IsNumber({}, { message: "Số tiền phải là một số!" })
    amount: number

    @ValidateIf((o) => o.phone !== null && o.phone !== undefined && o.phone !== '')
    @IsString({ message: "Loại hóa đơn phải là một chuỗi văn bản!" })
    type: string;

    @ValidateIf((o) => o.phone !== null && o.phone !== undefined && o.phone !== '')
    @IsString({ message: "Tiêu đề phải là một chuỗi văn bản!" })
    title: string;

    @ValidateIf((o) => o.phone !== null && o.phone !== undefined && o.phone !== '')
    @IsUUID(undefined, { message: "Mã hóa đơn không đúng định dạng!" })
    id: string

    @IsNotEmpty({ message: "Số căn hộ không được để trống!" })
    @IsInt({ message: "Số căn hộ phải là số nguyên!" })
    number: number;
}
