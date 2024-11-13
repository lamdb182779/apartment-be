import { Injectable } from '@nestjs/common';
import { CreateTentantDto } from './dto/create-tentant.dto';
import { UpdateTentantDto } from './dto/update-tentant.dto';

@Injectable()
export class TentantsService {
  create(createTentantDto: CreateTentantDto) {
    return 'This action adds a new tentant';
  }

  findAll() {
    return `This action returns all tentants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tentant`;
  }

  update(id: number, updateTentantDto: UpdateTentantDto) {
    return `This action updates a #${id} tentant`;
  }

  remove(id: number) {
    return `This action removes a #${id} tentant`;
  }
}
