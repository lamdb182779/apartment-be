import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { Visitor } from './entities/visitor.entity';
import { Between, IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { addDays, startOfDay } from 'date-fns';
import { Apartment } from 'src/apartments/entities/apartment.entity';

@Injectable()
export class VisitorsService {
  constructor(
    @InjectRepository(Visitor)
    private visitorsRepository: Repository<Visitor>,

    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>
  ) { }
  async create(createVisitorDto: CreateVisitorDto) {
    const { number, name } = createVisitorDto
    const apartment = await this.apartmentsRepository.findOneBy({ number, owner: Not(IsNull()) })
    if (!apartment) throw new BadRequestException(["Không thể thêm vào căn hộ này!"])
    const visitor = await this.visitorsRepository.save({ name, apartment })
    if (!visitor) throw new BadRequestException(["Lỗi khi thêm mới!"])
    return { message: "Thêm khách thăm thành công" }
  }

  async findAll(current: number, pageSize: number, date: Date) {
    current = (current && current > 0) ? current : 1
    pageSize = (pageSize && pageSize > 0) ? pageSize : 10
    const [visitors, count] = await this.visitorsRepository.findAndCount({
      take: pageSize,
      skip: (current - 1) * pageSize,
      where: {
        visitedAt: Between(startOfDay(date), startOfDay(addDays(date, 1)))
      },
      relations: ["apartment"]
    })
    return { results: visitors.map(({ apartment, ...rest }) => { return { ...rest, apartment: apartment.number } }), totalPages: Math.ceil(count / pageSize) };
  }

  findOne(id: string) {
    return `This action returns a #${id} visitor`;
  }

  async update(id: string, updateVisitorDto: UpdateVisitorDto) {
    const { number, ...rest } = updateVisitorDto
    const update = await this.visitorsRepository.update(id, rest)
    if (number) {
      const apartment = await this.apartmentsRepository.findOneBy({ number, owner: Not(IsNull()) })
      if (!apartment) throw new BadRequestException(["Không thể thêm vào căn hộ này!"])
      const update = await this.visitorsRepository.update(id, { apartment })
      if (update.affected === 0) throw new BadRequestException(["Cập nhật khách thăm thất bại!"])
    }
    if (update.affected === 0 && !number) throw new BadRequestException(["Cập nhật khách thăm thất bại!"])
    return { message: "Cập nhật thành công" };
  }

  remove(id: string) {
    return `This action removes a #${id} visitor`;
  }
}
