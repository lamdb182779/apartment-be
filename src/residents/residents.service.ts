import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Resident } from './entities/resident.entity';
import { Repository } from 'typeorm';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { generateUsername, hashPassword, transformFilterToILike } from 'src/helpers/utils';
import { add } from 'date-fns';

@Injectable()
export class ResidentsService {
  constructor(
    @InjectRepository(Resident)
    private residentsRepository: Repository<Resident>,

    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>,

  ) { }
  async create(createResidentDto: CreateResidentDto) {
    const { name, image, email, phone, number } = createResidentDto
    const existingEmail = await this.residentsRepository.findOne({ where: { email } })
    if (existingEmail) throw new BadRequestException([`Email ${email} đã tồn tại, vui lòng kiểm tra lại!`])
    let isUnique = false
    let username: string
    let hash: string
    while (!isUnique) {
      username = generateUsername(createResidentDto.name)
      const existingUser = await this.residentsRepository.findOne({ where: { username } })
      if (!existingUser) {
        isUnique = true
        hash = await hashPassword(username)
      }
    }

    const apartment = await this.apartmentsRepository.findOneBy({
      number
    })

    const resident = await this.residentsRepository.save({
      name, image, email, apartment, phone, username,
      password: hash,
    })

    return {
      id: resident.id,
      name: resident.name,
      email: resident.email,
      number: resident.apartment.number,
      username: resident.username
    }
  }

  async findAll(filter: Record<string, string>, current: number, pageSize: number, orderBy: string) {
    current = (current && current > 0) ? current : 1
    pageSize = (pageSize && pageSize > 0) ? pageSize : 10
    orderBy = (orderBy === "DESC") ? orderBy : "ASC"

    const [residents, count] = await this.residentsRepository.findAndCount({
      where: transformFilterToILike(filter),
      take: pageSize,
      skip: (current - 1) * pageSize,
      order: {
        createdAt: orderBy as any
      },
      relations: ["apartment"]
    })
    return { results: residents.map(({ createdAt, updatedAt, ...resident }) => resident), totalPages: Math.ceil(count / pageSize) }
  }

  findOne(id: string) {
    return `This action returns a #${id} resident`;
  }

  update(id: string, updateResidentDto: UpdateResidentDto) {
    return `This action updates a #${id} resident`;
  }

  remove(id: string) {
    return `This action removes a #${id} resident`;
  }
}
