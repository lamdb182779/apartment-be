import { Injectable } from '@nestjs/common';
import { CreateAccountantDto } from './dto/create-accountant.dto';
import { UpdateAccountantDto } from './dto/update-accountant.dto';

@Injectable()
export class AccountantsService {
  create(createAccountantDto: CreateAccountantDto) {
    return 'This action adds a new accountant';
  }

  findAll() {
    return `This action returns all accountants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} accountant`;
  }

  update(id: number, updateAccountantDto: UpdateAccountantDto) {
    return `This action updates a #${id} accountant`;
  }

  remove(id: number) {
    return `This action removes a #${id} accountant`;
  }
}
