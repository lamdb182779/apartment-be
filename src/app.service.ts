import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resident } from './residents/entities/resident.entity';
import { Regent } from './regents/entities/regent.entity';
import { Manager } from './managers/entities/manager.entity';
import { Technician } from './technicians/entities/technician.entity';
import { Receptionist } from './receptionists/entities/receptionist.entity';
import { Accountant } from './accountants/entities/accountant.entity';
import { Owner } from './owners/entities/owner.entity';
import { roles } from './helpers/utils';

@Injectable()
export class AppService {
  constructor(@InjectRepository(Owner)
  private ownersRepository: Repository<Owner>,

    @InjectRepository(Accountant)
    private accountantsRepository: Repository<Accountant>,

    @InjectRepository(Receptionist)
    private receptionistsRepository: Repository<Receptionist>,

    @InjectRepository(Technician)
    private techniciansRepository: Repository<Technician>,

    @InjectRepository(Manager)
    private managersRepository: Repository<Manager>,

    @InjectRepository(Regent)
    private regentsRepository: Repository<Regent>,

    @InjectRepository(Resident)
    private residentsRepository: Repository<Resident>,
  ) { }
  getHello(): string {
    return 'Hello World!';
  }
  async updateAvatar(user, image: string) {
    const key = Object.keys(roles).find(key => roles[key] === user.role)
    if (!key) throw new BadRequestException(["Không tìm thấy mã vai trò tương ứng!"])
    const update = await this[`${key}sRepository`].update(user.id, { image })
    if (update.affected === 0) throw new BadRequestException(["Không thể cập nhật ảnh đại diện!"])
    return { message: "Cập nhật ảnh đại diện thành công" }
  }
}
