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
        await this.commentsRepository.save(comment)
        return { message: "Thêm đánh giá thành công" }
      }
      case "resident": {
        comment.resident = user
        await this.commentsRepository.save(comment)
        return { message: "Thêm đánh giá thành công" }
      }
      default: throw new BadRequestException(["Vai trò người dùng không phù hợp!"])
    }
  }

  async findAll(current: number, pageSize: number) {
    current = (current && current > 0) ? current : 1
    pageSize = (pageSize && pageSize > 0) ? pageSize : 5
    const [cmt, count] = await this.commentsRepository.findAndCount({
      take: pageSize,
      skip: (current - 1) * pageSize,
      order: {
        createdAt: "ASC"
      },
      relations: ["owner", "resident", "replies"]
    })
    return { results: cmt, totalPages: Math.ceil(count / pageSize) }
  }

  async findSelfAll(current: number, pageSize: number, user) {
    const role = user.role
    const key = Object.keys(roles).find(key => roles[key] === role)
    current = (current && current > 0) ? current : 1
    pageSize = (pageSize && pageSize > 0) ? pageSize : 5

    const [cmt, count] = await this.commentsRepository.findAndCount({
      where: {
        [key]: {
          id: user.id
        }
      },
      take: pageSize,
      skip: (current - 1) * pageSize,
      order: {
        createdAt: "ASC"
      },
      relations: ["replies"]
    })
    return { results: cmt, totalPages: Math.ceil(count / pageSize) }
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  async remove(id: string, user) {
    const role = user.role
    const key = Object.keys(roles).find(key => roles[key] === role)
    const del = await this.commentsRepository.delete({ id, [key]: { id: user.id } })
    if (del.affected === 0) throw new BadRequestException(["Không thể xóa đánh giá này!"])
    return { message: "Xóa đánh giá thành công" }
  }
}
