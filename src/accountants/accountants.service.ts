import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountantDto } from './dto/create-accountant.dto';
import { UpdateAccountantDto } from './dto/update-accountant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accountant } from './entities/accountant.entity';
import { generateUsername, hashPassword, transformFilterToILike } from 'src/helpers/utils';

@Injectable()
export class AccountantsService {
  constructor(
    @InjectRepository(Accountant)
    private accountantsRepository: Repository<Accountant>
  ) { }
  async create(createAccountantDto: CreateAccountantDto) {
    const { name, image, email, phone } = createAccountantDto
    const existingEmail = await this.accountantsRepository.findOne({ where: { email } })
    if (existingEmail) throw new BadRequestException([`Email ${email} đã tồn tại, vui lòng kiểm tra lại!`])
    let isUnique = false
    let username: string
    let hash: string
    while (!isUnique) {
      username = generateUsername(createAccountantDto.name)
      const existingUser = await this.accountantsRepository.findOne({ where: { username } })
      if (!existingUser) {
        isUnique = true
        hash = await hashPassword(username)
      }
    }
    const owner = await this.accountantsRepository.save({
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

    const [accountants, count] = await this.accountantsRepository.findAndCount({
      where: transformFilterToILike(filter),
      take: pageSize,
      skip: (current - 1) * pageSize,
      order: {
        createdAt: orderBy as any
      }
    })
    return { results: accountants.map(({ createdAt, updatedAt, ...accountant }) => accountant), totalPages: Math.ceil(count / pageSize) }
  }

  findOne(id: string) {
    return `This action returns a #${id} accountant`;
  }

  async update(id: string, updateAccountantDto: UpdateAccountantDto) {
    const accountant = await this.accountantsRepository.findOne({
      where: {
        id
      },
    })
    if (!accountant) throw new NotFoundException([`Không tìm thấy chủ hộ mã số ${id}!`])
    const { name, email, phone } = updateAccountantDto
    if (email !== accountant.email) {
      const existingEmail = await this.accountantsRepository.findOne({ where: { email } })
      if (existingEmail) throw new BadRequestException([`Email ${email} đã tồn tại, vui lòng kiểm tra lại!`])
    }
    const update = await this.accountantsRepository.update(id, {
      name, email, phone
    })
    return { message: "Cập nhật thành công" }
  }

  async reactive(id: string) {
    const update = await this.accountantsRepository.update(id, {
      active: true
    })
    if (update.affected === 0) throw new BadRequestException(["Không thể ngừng hoạt động quản lý viên với mã số này!"])
    return ({ message: "Khôi phục thành công" })
  }

  async deactive(id: string) {
    const update = await this.accountantsRepository.update(id, {
      active: false
    })
    if (update.affected === 0) throw new BadRequestException(["Không thể ngừng hoạt động quản lý viên với mã số này!"])
    return ({ message: "Ngừng hoạt động thành công" })
  }

  async remove(id: string) {
    const del = await this.accountantsRepository.delete(id)
    if (del.affected === 0) throw new BadRequestException(["Không thể xóa thông tin!"])
    return ({ message: "Xóa thông tin thành công" })
  }
}
