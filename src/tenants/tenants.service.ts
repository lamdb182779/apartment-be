import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tentant.dto';
import { UpdateTenantDto } from './dto/update-tentant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { Repository } from 'typeorm';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { generateUsername, hashPassword, transformFilterToILike } from 'src/helpers/utils';
import { add } from 'date-fns';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,

    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>,

  ) { }
  async create(createTenantDto: CreateTenantDto) {
    const { name, image, email, phone, number } = createTenantDto
    const existingEmail = await this.tenantsRepository.findOne({ where: { email } })
    if (existingEmail) throw new BadRequestException([`Email ${email} đã tồn tại, vui lòng kiểm tra lại!`])
    let isUnique = false
    let username: string
    let hash: string
    while (!isUnique) {
      username = generateUsername(createTenantDto.name)
      const existingUser = await this.tenantsRepository.findOne({ where: { username } })
      if (!existingUser) {
        isUnique = true
        hash = await hashPassword(username)
      }
    }

    const apartment = await this.apartmentsRepository.findOneBy({
      number
    })

    const tenant = await this.tenantsRepository.save({
      name, image, email, apartment, phone, username,
      password: hash,
    })

    return {
      id: tenant.id,
      name: tenant.name,
      email: tenant.email,
      number: tenant.apartment.number,
      username: tenant.username
    }
  }

  async findAll(filter: Record<string, string>, current: number, pageSize: number, orderBy: string) {
    current = (current && current > 0) ? current : 1
    pageSize = (pageSize && pageSize > 0) ? pageSize : 10
    orderBy = (orderBy === "DESC") ? orderBy : "ASC"

    const [tenants, count] = await this.tenantsRepository.findAndCount({
      where: transformFilterToILike(filter),
      take: pageSize,
      skip: (current - 1) * pageSize,
      order: {
        createdAt: orderBy as any
      },
      relations: ["apartment"]
    })
    return { results: tenants.map(({ createdAt, updatedAt, ...tenant }) => tenant), totalPages: Math.ceil(count / pageSize) }
  }

  findOne(id: string) {
    return `This action returns a #${id} tenant`;
  }

  update(id: string, updateTenantDto: UpdateTenantDto) {
    return `This action updates a #${id} tenant`;
  }

  remove(id: string) {
    return `This action removes a #${id} tenant`;
  }
}
