import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reply } from './entities/reply.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Reply)
    private repliesRepository: Repository<Reply>,

    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>
  ) { }
  async create(createReplyDto: CreateReplyDto) {
    const { commentId, content } = createReplyDto
    const comment = await this.commentsRepository.findOneBy({ id: commentId })
    if (!comment) throw new NotFoundException(["Không tìm thấy đánh giá!"])
    const newReply = await this.repliesRepository.save({ content, comment })
    if (!newReply) throw new BadRequestException(["Không thể thêm phản hồi này!"])
    return { message: "Gửi phản hồi thành công" }
  }

  findAll() {
    return `This action returns all replies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reply`;
  }

  update(id: number, updateReplyDto: UpdateReplyDto) {
    return `This action updates a #${id} reply`;
  }

  async remove(id: string) {
    const del = await this.repliesRepository.delete(id)
    if (del.affected === 0) throw new BadRequestException(["Không thể xóa phản hồi này!"])
  }
}
