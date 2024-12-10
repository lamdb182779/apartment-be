import { Injectable } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

@Injectable()
export class BillsService {
  create(createBillDto: CreateBillDto) {
    return 'This action adds a new bill';
  }

  findAll() {
    return `This action returns all bills`;
  }

  findOne(id: string) {
    return `This action returns a #${id} bill`;
  }

  update(id: string, updateBillDto: UpdateBillDto) {
    return `This action updates a #${id} bill`;
  }

  remove(id: string) {
    return `This action removes a #${id} bill`;
  }
}
