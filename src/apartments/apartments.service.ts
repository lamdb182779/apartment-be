import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Apartment } from './entities/apartment.entity';
import { Between, Repository } from 'typeorm';
import { addMonths, isBefore, setDate, startOfMonth, subDays, subMonths } from 'date-fns';

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
    orderBy = (orderBy === "ASC") ? orderBy : "DESC"

    const [apartments, count] = await this.apartmentsRepository.findAndCount({
      where: filter,
      select: ["number", "acreage", "floor", "axis", "owner"],
      take: pageSize,
      skip: (current - 1) * pageSize,
      order: {
        number: orderBy as any
      }
    })
    return { results: apartments, totalPages: Math.ceil(count / pageSize) }
  }

  async findAllNumber() {
    const apartments = await this.apartmentsRepository.find()
    return apartments.map(({ number }) => number)
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
      relations: ["parameters", "tentants", "rooms"]
    })
    const { updatedAt, createdAt, parameters, tentants, rooms, ...result } = apartment
    return {
      ...result, parameters: parameters.reduce((acc, parameter) => {
        if (parameter.type === "electric") {
          acc.electric.push(parameter);
        } else if (parameter.type === "water") {
          acc.water.push(parameter);
        }
        return acc
      }, { electric: [], water: [] }),
      tentants: tentants.map(({ name, active }) => active ? name : null).filter(Boolean),
      rooms: rooms.map(({ createdAt, updatedAt, ...room }) => room)
    }
  }

  async findOwnerless() {
    const apartments = await this.apartmentsRepository
      .createQueryBuilder('apartment')
      .where(`apartment.owner IS NULL`)
      .getMany()
    return apartments.map(({ updatedAt, createdAt, ...apartment }) => apartment)
  }
  async findOwnered(floor?: number) {
    const query = this.apartmentsRepository
      .createQueryBuilder('apartment')
      .where('apartment.owner IS NOT NULL');

    if (floor) {
      query.andWhere('apartment.floor = :floor', { floor });
    }

    const apartments = await query.getMany()
    return apartments.map(({ updatedAt, createdAt, ...apartment }) => apartment)
  }

  async checkOwnered(number: number) {
    if (!number || isNaN(number)) throw new BadRequestException("Không rõ số nhà!")
    const apartment = await this.apartmentsRepository.findOne({
      where: {
        number
      },
      select: ["owner"],
      relations: ["owner"]
    })
    return apartment.owner.name
  }

  async findNearest(number: number, time: string) {
    if (!number || isNaN(number)) throw new BadRequestException("Không rõ số nhà!")
    const date = new Date(time)
    let current25th = setDate(date, 25);
    if (isBefore(date, current25th)) {
      current25th = setDate(subDays(current25th, 1), 25);
    }
    const apartment = await this.apartmentsRepository.findOne({
      where: {
        number,
        parameters: {
          month: Between(subMonths(current25th, 2), current25th)
        }
      },
      relations: ["parameters"]
    })

    return apartment.parameters.reduce(
      (acc, item) => {
        if (item.type === "electric") {
          acc.electric.push(item.value);
        } else if (item.type === "water") {
          acc.water.push(item.value);
        }
        return acc;
      },
      { electric: [] as number[], water: [] as number[], acreage: apartment.acreage, debt: apartment.debt }
    )
  }

  update(number: number, updateApartmentDto: UpdateApartmentDto) {
    return `This action updates a #${number} apartment`;
  }

  remove(number: number) {
    return `This action removes a #${number} apartment`;
  }
}
