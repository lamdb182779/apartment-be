import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Manager } from './entities/manager.entity';
import { Repository } from 'typeorm';
import { generateUsername, hashPassword, transformFilterToILike } from 'src/helpers/utils';

@Injectable()
export class ManagersService {
  constructor(
    @InjectRepository(Manager)
    private managersRepository: Repository<Manager>
  ) { }
  async create(createManagerDto: CreateManagerDto) {
    const { name, image, email, phone } = createManagerDto
    const existingEmail = await this.managersRepository.findOne({ where: { email } })
    if (existingEmail) throw new BadRequestException([`Email ${email} đã tồn tại, vui lòng kiểm tra lại!`])
    let isUnique = false
    let username: string
    let hash: string
    while (!isUnique) {
      username = generateUsername(createManagerDto.name)
      const existingUser = await this.managersRepository.findOne({ where: { username } })
      if (!existingUser) {
        isUnique = true
        hash = await hashPassword(username)
      }
    }
    const owner = await this.managersRepository.save({
      name, image, email, phone, username, password: hash
    })

    return {
      id: owner.id,
      name: owner.name,
      email: owner.email,
      username: owner.username
    }
  }

  async findAll(
    filter: Record<string, string>,
    current: number,
    pageSize: number,
    orderBy: string,
    active: string
  ) {
    current = current && current > 0 ? current : 1;
    pageSize = pageSize && pageSize > 0 ? pageSize : 10;
    orderBy = orderBy === 'DESC' ? 'DESC' : 'ASC';
    const isActive = active === 'false' ? false : true;

    const keyword = filter?.name || '';
    const offset = (current - 1) * pageSize;

    const query = `
    SELECT id, name, email, phone, "createdAt", "updatedAt", '${'manager'}' AS role FROM manager WHERE name ILIKE $1 AND active = $2
    UNION ALL
    SELECT id, name, email, phone, "createdAt", "updatedAt", '${'technician'}' AS role FROM technician WHERE name ILIKE $1 AND active = $2
    UNION ALL
    SELECT id, name, email, phone, "createdAt", "updatedAt", '${'accountant'}' AS role FROM accountant WHERE name ILIKE $1 AND active = $2
    UNION ALL
    SELECT id, name, email, phone, "createdAt", "updatedAt", '${'receptionist'}' AS role FROM receptionist WHERE name ILIKE $1 AND active = $2
    ORDER BY "createdAt" ${orderBy}
    LIMIT $3 OFFSET $4
  `;

    const countQuery = `
    SELECT COUNT(*) FROM (
      SELECT id FROM manager WHERE name ILIKE $1 AND active = $2
      UNION ALL
      SELECT id FROM technician WHERE name ILIKE $1 AND active = $2
      UNION ALL
      SELECT id FROM accountant WHERE name ILIKE $1 AND active = $2
      UNION ALL
      SELECT id FROM receptionist WHERE name ILIKE $1 AND active = $2
    ) AS total
  `;

    const params = [`%${keyword}%`, isActive, pageSize, offset];

    const data = await this.managersRepository.query(query, params);
    const totalResult = await this.managersRepository.query(countQuery, [`%${keyword}%`, isActive]);
    const total = parseInt(totalResult[0].count, 10);

    return {
      results: data.map(({ createdAt, updatedAt, ...rest }) => rest),
      totalPages: Math.ceil(total / pageSize),
    };
  }


  findOne(id: string) {
    return `This action returns a #${id} manager`;
  }

  async update(id: string, updateManagerDto: UpdateManagerDto) {
    const manager = await this.managersRepository.findOne({
      where: {
        id
      },
    })
    if (!manager) throw new NotFoundException([`Không tìm thấy chủ hộ mã số ${id}!`])
    const { name, email, phone } = updateManagerDto
    if (email !== manager.email) {
      const existingEmail = await this.managersRepository.findOne({ where: { email } })
      if (existingEmail) throw new BadRequestException([`Email ${email} đã tồn tại, vui lòng kiểm tra lại!`])
    }
    const update = await this.managersRepository.update(id, {
      name, email, phone
    })
    return { message: "Cập nhật thành công" }
  }

  async reactive(id: string) {
    const update = await this.managersRepository.update(id, {
      active: true
    })
    if (update.affected === 0) throw new BadRequestException(["Không thể ngừng hoạt động quản lý viên với mã số này!"])
    return ({ message: "Khôi phục thành công" })
  }

  async deactive(id: string) {
    const update = await this.managersRepository.update(id, {
      active: false
    })
    if (update.affected === 0) throw new BadRequestException(["Không thể ngừng hoạt động quản lý viên với mã số này!"])
    return ({ message: "Ngừng hoạt động thành công" })
  }

  async remove(id: string) {
    const del = await this.managersRepository.delete(id)
    if (del.affected === 0) throw new BadRequestException(["Không thể xóa thông tin!"])
    return ({ message: "Xóa thông tin thành công" })
  }
}
