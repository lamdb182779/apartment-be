import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { generateUsername, hashPassword, transformFilterToILike } from 'src/helpers/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Technician } from './entities/technician.entity';

@Injectable()
export class TechniciansService {
  constructor(
    @InjectRepository(Technician)
    private techniciansRepository: Repository<Technician>
  ) { }
  async create(createTechnicianDto: CreateTechnicianDto) {
    const { name, image, email, phone } = createTechnicianDto
    const existingEmail = await this.techniciansRepository.findOne({ where: { email } })
    if (existingEmail) throw new BadRequestException([`Email ${email} đã tồn tại, vui lòng kiểm tra lại!`])
    let isUnique = false
    let username: string
    let hash: string
    while (!isUnique) {
      username = generateUsername(createTechnicianDto.name)
      const existingUser = await this.techniciansRepository.findOne({ where: { username } })
      if (!existingUser) {
        isUnique = true
        hash = await hashPassword(username)
      }
    }
    const owner = await this.techniciansRepository.save({
      name, image, email, phone, username, password: hash
    })

    return {
      id: owner.id,
      name: owner.name,
      email: owner.email,
      username: owner.username
    }
  }

  async findAll(filter: Record<string, string>, current: number, pageSize: number, orderBy: string) {
    current = (current && current > 0) ? current : 1
    pageSize = (pageSize && pageSize > 0) ? pageSize : 10
    orderBy = (orderBy === "DESC") ? orderBy : "ASC"

    const [technicians, count] = await this.techniciansRepository.findAndCount({
      where: transformFilterToILike(filter),
      take: pageSize,
      skip: (current - 1) * pageSize,
      order: {
        createdAt: orderBy as any
      }
    })
    return { results: technicians.map(({ createdAt, updatedAt, ...technician }) => technician), totalPages: Math.ceil(count / pageSize) }
  }

  findOne(id: string) {
    return `This action returns a #${id} technician`;
  }

  update(id: string, updateTechnicianDto: UpdateTechnicianDto) {
    return `This action updates a #${id} technician`;
  }

  remove(id: string) {
    return `This action removes a #${id} technician`;
  }
}
