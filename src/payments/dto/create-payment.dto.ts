import { IsNotEmpty, IsUUID } from "class-validator";

export class CreatePaymentDto {
    @IsNotEmpty({ message: "Mã hóa đơn không được để trống!" })
    @IsUUID(undefined, { message: "Mã hóa đơn không đúng định dạng!" })
    orderId: string;
}
