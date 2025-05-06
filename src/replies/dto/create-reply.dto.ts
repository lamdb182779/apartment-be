import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateReplyDto {
    @IsNotEmpty({ message: "Phản hổi không được để trống!" })
    @IsString({ message: "Phản hồi phải là một chuỗi văn bản!" })
    content: string;

    @IsNotEmpty({ message: "Mã đánh giá không được để trống!" })
    @IsUUID(undefined, { message: "Mã đánh giá phải là một chuỗi uuid!" })
    commentId: string;
}
