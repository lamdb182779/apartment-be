import { Injectable } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';

@Injectable()
export class VisitorsService {
  create(createVisitorDto: CreateVisitorDto) {
    return 'This action adds a new visitor';
  }

  findAll() {
    return `This action returns all visitors`;
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
