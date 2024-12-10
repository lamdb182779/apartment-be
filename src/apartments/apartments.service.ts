import { Injectable } from '@nestjs/common';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Apartment } from './entities/apartment.entity';
import { Between, Repository } from 'typeorm';
import { subMonths } from 'date-fns';

@Injectable()
export class ApartmentsService {
  constructor(
    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>
  ) { }
  create(createApartmentDto: CreateApartmentDto) {
    return 'This action adds a new apartment';
  }

  async findAll(filter: Record<string, string>, current: number, pageSize: number, orderBy: string) {
    current = (current && current > 0) ? current : 1
    pageSize = (pageSize && pageSize > 0) ? pageSize : 10
    orderBy = (orderBy === "DESC") ? orderBy : "ASC"

    const [apartments, count] = await this.apartmentsRepository.findAndCount({
      where: filter,
      select: ["number", "acreage", "floor", "axis", "owner"],
      take: pageSize,
      skip: (current - 1) * pageSize,
      order: {
        floor: orderBy as any
      }
    })
    return { results: apartments, totalPages: Math.ceil(count / pageSize) }
  }

  async findOne(number: number) {
    const now = new Date()
    const apartment = await this.apartmentsRepository.findOne({
      where: {
        number,
        parameters: {
          month: Between(subMonths(now, 6), now),
        },
      },
      relations: ["parameters", "tentants"]
    })
    const { updatedAt, createdAt, parameters, tentants, ...result } = apartment
    return {
      ...result, parameters: parameters.reduce((acc, parameter) => {
        if (parameter.type === "electric") {
          acc.electric.push(parameter);
        } else if (parameter.type === "water") {
          acc.water.push(parameter);
        }
        return acc
      }, { electric: [], water: [] }),
      tentants: tentants.map(({ name, active }) => active ? name : null).filter(Boolean)
    }
  }

  async findOwnerless() {
    const apartments = await this.apartmentsRepository
      .createQueryBuilder('apartment')
      .where(`apartment.owner IS NULL`)
      .getMany()
    return apartments.map(({ updatedAt, createdAt, ...apartment }) => apartment)
  }

  update(number: number, updateApartmentDto: UpdateApartmentDto) {
    return `This action updates a #${number} apartment`;
  }

  remove(number: number) {
    return `This action removes a #${number} apartment`;
  }
}
