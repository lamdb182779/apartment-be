import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReceptionistDto } from './dto/create-receptionist.dto';
import { UpdateReceptionistDto } from './dto/update-receptionist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Receptionist } from './entities/receptionist.entity';
import { Repository } from 'typeorm';
import { generateUsername, hashPassword, transformFilterToILike } from 'src/helpers/utils';

@Injectable()
export class ReceptionistsService {
  constructor(
    @InjectRepository(Receptionist)
    private receptionistsRepository: Repository<Receptionist>
  ) { }
  async create(createReceptionistDto: CreateReceptionistDto) {
    const { name, image, email, phone } = createReceptionistDto
    const existingEmail = await this.receptionistsRepository.findOne({ where: { email } })
    if (existingEmail) throw new BadRequestException([`Email ${email} đã tồn tại, vui lòng kiểm tra lại!`])
    let isUnique = false
    let username: string
    let hash: string
    while (!isUnique) {
      username = generateUsername(createReceptionistDto.name)
      const existingUser = await this.receptionistsRepository.findOne({ where: { username } })
      if (!existingUser) {
        isUnique = true
        hash = await hashPassword(username)
      }
    }
    const owner = await this.receptionistsRepository.save({
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

    const [receptionists, count] = await this.receptionistsRepository.findAndCount({
      where: transformFilterToILike(filter),
      take: pageSize,
      skip: (current - 1) * pageSize,
      order: {
        createdAt: orderBy as any
      }
    })
    return { results: receptionists.map(({ createdAt, updatedAt, ...receptionist }) => receptionist), totalPages: Math.ceil(count / pageSize) }
  }

  findOne(id: string) {
    return `This action returns a #${id} receptionist`;
  }

  async update(id: string, updateReceptionistDto: UpdateReceptionistDto) {
    const receptionist = await this.receptionistsRepository.findOne({
      where: {
        id
      },
    })
    if (!receptionist) throw new NotFoundException([`Không tìm thấy chủ hộ mã số ${id}!`])
    const { name, email, phone } = updateReceptionistDto
    if (email !== receptionist.email) {
      const existingEmail = await this.receptionistsRepository.findOne({ where: { email } })
      if (existingEmail) throw new BadRequestException([`Email ${email} đã tồn tại, vui lòng kiểm tra lại!`])
    }
    const update = await this.receptionistsRepository.update(id, {
      name, email, phone
    })
    return { message: "Cập nhật thành công" }
  }

  async reactive(id: string) {
    const update = await this.receptionistsRepository.update(id, {
      active: true
    })
    if (update.affected === 0) throw new BadRequestException(["Không thể ngừng hoạt động quản lý viên với mã số này!"])
    return ({ message: "Khôi phục thành công" })
  }

  async deactive(id: string) {
    const update = await this.receptionistsRepository.update(id, {
      active: false
    })
    if (update.affected === 0) throw new BadRequestException(["Không thể ngừng hoạt động quản lý viên với mã số này!"])
    return ({ message: "Ngừng hoạt động thành công" })
  }

  async remove(id: string) {
    const del = await this.receptionistsRepository.delete(id)
    if (del.affected === 0) throw new BadRequestException(["Không thể xóa thông tin!"])
    return ({ message: "Xóa thông tin thành công" })
  }
}
