
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Owner } from 'src/owners/entities/owner.entity';
import { Repository } from 'typeorm';
import { Accountant } from 'src/accountants/entities/accountant.entity';
import { Receptionist } from 'src/receptionists/entities/receptionist.entity';
import { Technician } from 'src/technicians/entities/technician.entity';
import { Director } from 'src/directors/entities/director.entity';
import { Regent } from 'src/regents/entities/regent.entity';
import { Resident } from 'src/residents/entities/resident.entity';
import { roles } from 'src/helpers/utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,

    @InjectRepository(Owner)
    private ownersRepository: Repository<Owner>,

    @InjectRepository(Accountant)
    private accountantsRepository: Repository<Accountant>,

    @InjectRepository(Receptionist)
    private receptionistsRepository: Repository<Receptionist>,

    @InjectRepository(Technician)
    private techniciansRepository: Repository<Technician>,

    @InjectRepository(Director)
    private directorsRepository: Repository<Director>,

    @InjectRepository(Regent)
    private regentsRepository: Repository<Regent>,

    @InjectRepository(Resident)
    private residentsRepository: Repository<Resident>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const { role, id } = payload
    const key = Object.keys(roles).find(key => roles[key] === role)
    if (!key) throw new BadRequestException("Không tìm thấy mã vai trò tương ứng!")
    switch (key) {
      case "owner": {
        const owner = await this.ownersRepository.findOneBy({
          id,
          active: true
        })
        if (!owner) throw new UnauthorizedException("Không tìm thấy chủ hộ đang hoạt động với tài khoản này, vui lòng kiểm tra lại!")
        return owner
      }
      case "accountant": {
        const accountant = await this.accountantsRepository.findOneBy({
          id,
          active: true
        })
        if (!accountant) throw new UnauthorizedException("Không tìm thấy kế toán đang hoạt động với tài khoản này, vui lòng kiểm tra lại!")
        return accountant
      }
      case "resident": {
        const resident = await this.residentsRepository.findOneBy({
          id,
          active: true
        })
        if (!resident) throw new UnauthorizedException("Không tìm thấy cư dân đang hoạt động với tài khoản này, vui lòng kiểm tra lại!")
        return resident
      }
      case "receptionist": {
        const receptionist = await this.receptionistsRepository.findOneBy({
          id,
          active: true
        })
        if (!receptionist) throw new UnauthorizedException("Không tìm thấy lễ tân đang hoạt động với tài khoản này, vui lòng kiểm tra lại!")
        return receptionist
      }
      case "technician": {
        const technician = await this.techniciansRepository.findOneBy({
          id,
          active: true
        })
        if (!technician) throw new UnauthorizedException("Không tìm thấy kỹ thuật viên đang hoạt động với tài khoản này, vui lòng kiểm tra lại!")
        return technician
      }
      case "regent": {
        const regent = await this.regentsRepository.findOneBy({
          id,
          active: true
        })
        if (!regent) throw new UnauthorizedException("Không tìm thấy thành viên ban quản trị đang hoạt động với tài khoản này, vui lòng kiểm tra lại!")
        return regent
      }
      case "director": {
        const director = await this.directorsRepository.findOneBy({
          id,
          active: true
        })
        if (!director) throw new UnauthorizedException("Không tìm thấy trưởng ban quản lý đang hoạt động với tài khoản này, vui lòng kiểm tra lại!")
        return director
      }
      default: throw new BadRequestException("Không tìm thấy mã vai trò tương ứng!")
    }
  }
}
