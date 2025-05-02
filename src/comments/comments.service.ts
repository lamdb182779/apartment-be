import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { roles } from 'src/helpers/utils';
import { Resident } from 'src/residents/entities/resident.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Owner } from 'src/owners/entities/owner.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,

    @InjectRepository(Owner)
    private ownersRepository: Repository<Owner>,

    @InjectRepository(Resident)
    private residentsRepository: Repository<Resident>
  ) { }
  async create(createCommentDto: CreateCommentDto, user: any) {
    const role = user.role
    const key = Object.keys(roles).find(key => roles[key] === role)
    const comment = await this.commentsRepository.save(createCommentDto)
    switch (key) {
      case "owner": {
        comment.owner = user
        return { message: "Thêm đánh giá thành công" }
      }
      case "resident": {
        comment.resident = user
        return { message: "Thêm đánh giá thành công" }
      }
      default: throw new BadRequestException(["Vai trò người dùng không phù hợp!"])
    }
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
