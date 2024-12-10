import { BadRequestException, Injectable } from '@nestjs/common';
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

  update(id: string, updateAccountantDto: UpdateAccountantDto) {
    return `This action updates a #${id} accountant`;
  }

  remove(id: string) {
    return `This action removes a #${id} accountant`;
  }
}
