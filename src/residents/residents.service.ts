import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Resident } from './entities/resident.entity';
import { Between, ILike, IsNull, Not, Repository } from 'typeorm';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { generateUsername, hashPassword, transformFilterToILike } from 'src/helpers/utils';
import { add, subMonths } from 'date-fns';

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

  async findAll(filter: Record<string, string>, current: number, pageSize: number, orderBy: string, active: string) {
    current = (current && current > 0) ? current : 1
    pageSize = (pageSize && pageSize > 0) ? pageSize : 10
    orderBy = (orderBy === "DESC") ? orderBy : "ASC"

    const [residents, count] = await this.residentsRepository.findAndCount({
      where: {
        ...transformFilterToILike(filter),
        active: active === "false" ? false : true
      },
      take: pageSize,
      skip: (current - 1) * pageSize,
      order: {
        createdAt: orderBy as any
      },
      relations: ["apartment"]
    })
    return { results: residents.map(({ createdAt, updatedAt, username, isVerify, ...resident }) => ({ ...resident, isVerify, username: !isVerify ? username : undefined })), totalPages: Math.ceil(count / pageSize) }
  }

  async findApartmentInfo(id: string) {
    const now = new Date()
    const apartment = await this.apartmentsRepository.findOne({
      where: {
        residents: { id },
        parameters: {
          month: Between(subMonths(now, 6), now),
          value: Not(IsNull())
        },
      },
      relations: ["parameters", "residents", "rooms"]
    })
    if (!apartment) throw new NotFoundException(["Không tìm thấy căn hộ đang ở!"])
    const { updatedAt, createdAt, parameters, residents, rooms, ...result } = apartment
    return {
      ...result, parameters: parameters.reduce((acc, parameter) => {
        if (parameter.type === "electric") {
          acc.electric.push(parameter);
        } else if (parameter.type === "water") {
          acc.water.push(parameter);
        }
        return acc
      }, { electric: [], water: [] }),
      residents: residents.map(({ name, active }) => active ? name : null).filter(Boolean),
      rooms: rooms.map(({ createdAt, updatedAt, ...room }) => room)
    }
  }

  async findAllByName(name: string) {
    const residents = await this.residentsRepository.find({
      where: {
        name: ILike(`%${name}%`)
      },
      relations: ["apartment"]
    })
    return residents.map(({ apartment, name, id }) => ({ name, id, apartment: apartment.number }))
  }

  async findSelfApartment(id: string) {
    const apartments = await this.apartmentsRepository.find({
      where: {
        residents: {
          id,
        },
      },
      relations: ["owner", "residents", "rooms", "bills"]
    })
    return apartments.map(({ createdAt, updatedAt, owner, residents, rooms, bills, ...apartment }) => {
      return {
        ...apartment,
        residents: residents.map(({ name, active }) => active ? name : null).filter(Boolean),
        rooms: rooms.map(({ type }) => type),
        debt: bills.reduce((acc: number, bill) => {
          if (bill.isPaid) return acc
          return bill.amount - 0 + acc
        }, 0)
      }
    })
  }

  findOne(id: string) {
    return `This action returns a #${id} resident`;
  }

  async update(id: string, updateResidentDto: UpdateResidentDto) {
    const resident = await this.residentsRepository.findOne({
      where: {
        id
      },
      relations: ["apartment"]
    })
    if (!resident) throw new NotFoundException([`Không tìm thấy chủ hộ mã số ${id}!`])
    const { name, image, email, phone, number } = updateResidentDto
    if (email !== resident.email) {
      const existingEmail = await this.residentsRepository.findOne({ where: { email } })
      if (existingEmail) throw new BadRequestException([`Email ${email} đã tồn tại, vui lòng kiểm tra lại!`])
    }
    const update = await this.residentsRepository.update(id, {
      name, image, email, phone
    })
    const apt = await this.apartmentsRepository.findOne({
      where: {
        number,
        owner: Not(IsNull()),
      }
    })
    if (!apt) throw new NotFoundException(["Không thấy căn hộ với mã số này!"])
    resident.apartment = apt
    await this.residentsRepository.save(resident)
    return { message: "Cập nhật thành công" }
  }
  async reactive(id: string) {
    const update = await this.residentsRepository.update(id, {
      active: true
    })
    if (update.affected === 0) throw new BadRequestException(["Không thể ngừng hoạt động cư dân với mã số này!"])
    return ({ message: "Khôi phục thành công" })
  }

  async deactive(id: string) {
    const update = await this.residentsRepository.update(id, {
      active: false
    })
    if (update.affected === 0) throw new BadRequestException(["Không thể ngừng hoạt động cư dân với mã số này!"])
    return ({ message: "Ngừng hoạt động thành công" })
  }

  remove(id: string) {
    return `This action removes a #${id} resident`;
  }
}
