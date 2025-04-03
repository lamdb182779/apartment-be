import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTentantDto } from './dto/create-tentant.dto';
import { UpdateTentantDto } from './dto/update-tentant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tentant } from './entities/tentant.entity';
import { Repository } from 'typeorm';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { generateUsername, hashPassword, transformFilterToILike } from 'src/helpers/utils';
import { add } from 'date-fns';

@Injectable()
export class TentantsService {
  constructor(
    @InjectRepository(Tentant)
    private tentantsRepository: Repository<Tentant>,

    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>,

  ) { }
  async create(createTentantDto: CreateTentantDto) {
    const { name, image, email, phone, number } = createTentantDto
    const existingEmail = await this.tentantsRepository.findOne({ where: { email } })
    if (existingEmail) throw new BadRequestException([`Email ${email} đã tồn tại, vui lòng kiểm tra lại!`])
    let isUnique = false
    let username: string
    let hash: string
    while (!isUnique) {
      username = generateUsername(createTentantDto.name)
      const existingUser = await this.tentantsRepository.findOne({ where: { username } })
      if (!existingUser) {
        isUnique = true
        hash = await hashPassword(username)
      }
    }

    const apartment = await this.apartmentsRepository.findOneBy({
      number
    })

    const tentant = await this.tentantsRepository.save({
      name, image, email, apartment, phone, username,
      password: hash,
    })

    return {
      id: tentant.id,
      name: tentant.name,
      email: tentant.email,
      number: tentant.apartment.number,
      username: tentant.username
    }
  }

  async findAll(filter: Record<string, string>, current: number, pageSize: number, orderBy: string) {
    current = (current && current > 0) ? current : 1
    pageSize = (pageSize && pageSize > 0) ? pageSize : 10
    orderBy = (orderBy === "DESC") ? orderBy : "ASC"

    const [tentants, count] = await this.tentantsRepository.findAndCount({
      where: transformFilterToILike(filter),
      take: pageSize,
      skip: (current - 1) * pageSize,
      order: {
        createdAt: orderBy as any
      },
      relations: ["apartment"]
    })
    return { results: tentants.map(({ createdAt, updatedAt, ...tentant }) => tentant), totalPages: Math.ceil(count / pageSize) }
  }

  findOne(id: string) {
    return `This action returns a #${id} tentant`;
  }

  update(id: string, updateTentantDto: UpdateTentantDto) {
    return `This action updates a #${id} tentant`;
  }

  remove(id: string) {
    return `This action removes a #${id} tentant`;
  }
}
