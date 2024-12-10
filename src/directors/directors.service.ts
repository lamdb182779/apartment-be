import { Injectable } from '@nestjs/common';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';

@Injectable()
export class DirectorsService {
  create(createDirectorDto: CreateDirectorDto) {
    return 'This action adds a new director';
  }

  findAll() {
    return `This action returns all directors`;
  }

  findOne(id: string) {
    return `This action returns a #${id} director`;
  }

  update(id: string, updateDirectorDto: UpdateDirectorDto) {
    return `This action updates a #${id} director`;
  }

  remove(id: string) {
    return `This action removes a #${id} director`;
  }
}
