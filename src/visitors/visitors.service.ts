import { Injectable } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { Visitor } from './entities/visitor.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { addDays, startOfDay } from 'date-fns';

@Injectable()
export class VisitorsService {
  constructor(
    @InjectRepository(Visitor)
    private visitorsRepository: Repository<Visitor>
  ) { }
  create(createVisitorDto: CreateVisitorDto) {
    return 'This action adds a new visitor';
  }

  async findAll(query: any) {
    const { number, time } = query
    const date = new Date(time)
    const visitors = await this.visitorsRepository.find({
      where: {
        apartment: { number },
        visitedAt: Between(startOfDay(date), startOfDay(addDays(date, 1)))
      },
      relations: ["apartment"]
    })
    return visitors;
  }

  findOne(id: string) {
    return `This action returns a #${id} visitor`;
  }

  update(id: string, updateVisitorDto: UpdateVisitorDto) {
    return `This action updates a #${id} visitor`;
  }

  remove(id: string) {
    return `This action removes a #${id} visitor`;
  }
}
