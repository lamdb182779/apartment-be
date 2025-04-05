import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Owner } from './entities/owner.entity';
import { Repository } from 'typeorm';
import { generateUsername, hashPassword, transformFilterToILike } from 'src/helpers/utils';
import { Apartment } from 'src/apartments/entities/apartment.entity';

@Injectable()
export class OwnersService {
  constructor(
    @InjectRepository(Owner)
    private ownersRepository: Repository<Owner>,

    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>
  ) { }
  async create(createOwnerDto: CreateOwnerDto) {
    const { name, email, phone, apartments } = createOwnerDto
    const existingEmail = await this.ownersRepository.findOne({ where: { email } })
    if (existingEmail) throw new BadRequestException([`Email ${email} đã tồn tại, vui lòng kiểm tra lại!`])
    let isUnique = false
    let username: string
    let hash: string
    while (!isUnique) {
      username = generateUsername(createOwnerDto.name)
      const existingUser = await this.ownersRepository.findOne({ where: { username } })
      if (!existingUser) {
        isUnique = true
        hash = await hashPassword(username)
      }
    }

    const owner = await this.ownersRepository.save({
      name, email, phone, username,
      password: hash,
    })
    const numberErrors = []
    const errors = []
    for (const number of apartments) {
      const apartment = await this.apartmentsRepository.createQueryBuilder()
        .update(Apartment)
        .set({ owner })
        .where('number = :number AND owner IS NULL', { number })
        .execute()
      if (apartment.affected === 0) numberErrors.push(number)
    }
    if (numberErrors.length > 0) errors.push(`Không thể thêm quyền sở hữu căn hộ ${numberErrors.join(", ")}!`)

    if (errors.length > 0) throw new BadRequestException(errors)
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

    const [owners, count] = await this.ownersRepository.findAndCount({
      where: transformFilterToILike(filter),
      take: pageSize,
      skip: (current - 1) * pageSize,
      order: {
        createdAt: orderBy as any
      },
      relations: ["apartments"]
    })
    return { results: owners.map(({ createdAt, updatedAt, ...owner }) => owner), totalPages: Math.ceil(count / pageSize) }
  }

  async findSelfApartment(id: string) {
    const apartments = await this.apartmentsRepository.find({
      where: {
        owner: {
          id,
        },
      },
      relations: ["owner", "residents", "rooms"]
    })
    return apartments.map(({ createdAt, updatedAt, owner, residents, rooms, ...apartment }) => {
      return {
        ...apartment, residents: residents.map(({ name, active }) => active ? name : null).filter(Boolean), rooms: rooms.map(({ type }) => type)
      }
    })
  }

  async findSelfAccount() {

  }

  async findOne(id: string) {
    const owner = await this.ownersRepository.findOne({
      where: {
        id: id
      },
      select: ["id", "image", "active", "email", "phone"],
      relations: ["apartments"]
    })
    return { ...owner, apartments: owner.apartments.map(({ updatedAt, createdAt, ...apartment }) => apartment) }
  }

  async update(id: string, updateOwnerDto: UpdateOwnerDto) {
    const owner = await this.ownersRepository.findOneBy({ id: id })
    if (!owner) throw new NotFoundException([`Không tìm thấy chủ hộ mã số ${id}!`])
    const { name, image, email, phone, apartments } = updateOwnerDto
    if (email !== owner.email) {
      const existingEmail = await this.ownersRepository.findOne({ where: { email } })
      if (existingEmail) throw new BadRequestException([`Email ${email} đã tồn tại, vui lòng kiểm tra lại!`])
    }
    const numberErrors = []
    const errors = []
    for (const number of apartments) {
      const apartment = await this.apartmentsRepository.createQueryBuilder()
        .update(Apartment)
        .set({ owner })
        .where('number = :number AND owner IS NULL', { number })
        .execute()
      if (apartment.affected === 0) numberErrors.push(number)
    }
    if (numberErrors.length > 0) errors.push(`Không thể thêm quyền sở hữu căn hộ ${numberErrors.join(", ")}!`)
    const update = await this.ownersRepository.update(id, {
      name, image, email, phone
    })
    if (update.affected === 0) errors.push("Không thể cập nhật thông tin cá nhân chủ hộ!")
    if (errors.length > 0) throw new BadRequestException(errors)
    return { message: "Cập nhật thành công" }
  }

  remove(id: string) {
    return `This action removes a #${id} owner`;
  }
}
