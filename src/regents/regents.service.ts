import { Injectable } from '@nestjs/common';
import { CreateRegentDto } from './dto/create-regent.dto';
import { UpdateRegentDto } from './dto/update-regent.dto';

@Injectable()
export class RegentsService {
  create(createRegentDto: CreateRegentDto) {
    return 'This action adds a new regent';
  }

  findAll() {
    return `This action returns all regents`;
  }

  findOne(id: string) {
    return `This action returns a #${id} regent`;
  }

  update(id: string, updateRegentDto: UpdateRegentDto) {
    return `This action updates a #${id} regent`;
  }

  remove(id: string) {
    return `This action removes a #${id} regent`;
  }
}
