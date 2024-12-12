import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Accountant } from 'src/accountants/entities/accountant.entity';
import { comparePassword, generateSecureOtp, getName, hashPassword, maskEmail, roles } from 'src/helpers/utils';
import { Owner } from 'src/owners/entities/owner.entity';
import { Tentant } from 'src/tentants/entities/tentant.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { add, isAfter, isBefore } from 'date-fns';
import { Receptionist } from 'src/receptionists/entities/receptionist.entity';
import { Technician } from 'src/technicians/entities/technician.entity';
import { Director } from 'src/directors/entities/director.entity';
import { Regent } from 'src/regents/entities/regent.entity';

@Injectable()
export class AuthService {
    constructor(
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

        @InjectRepository(Tentant)
        private tentantsRepository: Repository<Tentant>,

        private jwtService: JwtService,

        private readonly mailerService: MailerService

    ) { }

    async validateUser(username: string, plainPassword: string, role: number): Promise<any> {
        const key = Object.keys(roles).find(key => roles[key] === role)
        if (!key) throw new BadRequestException("Không tìm thấy mã vai trò tương ứng!")
        switch (key) {
            case "owner": {
                const owner = await this.ownersRepository.findOne({
                    where: {
                        username: username,
                        active: true
                    },
                    select: ['id', 'username', 'email', 'password', "active", "image", "name", "phone", "role", "isVerify"],
                })
                if (!owner) throw new UnauthorizedException("Không tìm thấy chủ hộ đang hoạt động với tài khoản này, vui lòng kiểm tra lại!")
                const compare = await comparePassword(plainPassword, owner.password)
                if (!compare) throw new UnauthorizedException("Sai mật khẩu, vui lòng kiểm tra lại!")
                const { password, ...result } = owner
                return result
            }
            case "accountant": {
                const accountant = await this.accountantsRepository.findOne({
                    where: {
                        username: username,
                        active: true
                    },
                    select: ['id', 'username', 'email', 'password', "active", "image", "name", "phone", "role"],
                })
                if (!accountant) throw new UnauthorizedException("Không tìm thấy kế toán đang hoạt động với tài khoản này, vui lòng kiểm tra lại!")
                const compare = await comparePassword(plainPassword, accountant.password)
                if (!compare) throw new UnauthorizedException("Sai mật khẩu, vui lòng kiểm tra lại!")
                const { password, ...result } = accountant
                return result
            }
            case "tentant": {
                const tentant = await this.tentantsRepository.findOne({
                    where: {
                        username: username,
                        active: true
                    },
                    select: ['id', 'username', 'email', 'password', "active", "image", "name", "phone", "role", "apartment", "isVerify"],
                })
                if (!tentant) throw new UnauthorizedException("Không tìm thấy người thuê đang hoạt động với tài khoản này, vui lòng kiểm tra lại!")
                const compare = await comparePassword(plainPassword, tentant.password)
                if (!compare) throw new UnauthorizedException("Sai mật khẩu, vui lòng kiểm tra lại!")
                const { password, ...result } = tentant
                return result
            }
            case "receptionist": {
                const receptionist = await this.receptionistsRepository.findOne({
                    where: {
                        username: username,
                        active: true
                    },
                    select: ['id', 'username', 'email', 'password', "active", "image", "name", "phone", "role"],
                })
                if (!receptionist) throw new UnauthorizedException("Không tìm thấy lễ tân đang hoạt động với tài khoản này, vui lòng kiểm tra lại!")
                const compare = await comparePassword(plainPassword, receptionist.password)
                if (!compare) throw new UnauthorizedException("Sai mật khẩu, vui lòng kiểm tra lại!")
                const { password, ...result } = receptionist
                return result
            }
            case "technician": {
                const technician = await this.techniciansRepository.findOne({
                    where: {
                        username: username,
                        active: true
                    },
                    select: ['id', 'username', 'email', 'password', "active", "image", "name", "phone", "role"],
                })
                if (!technician) throw new UnauthorizedException("Không tìm thấy kỹ thuật viên đang hoạt động với tài khoản này, vui lòng kiểm tra lại!")
                const compare = await comparePassword(plainPassword, technician.password)
                if (!compare) throw new UnauthorizedException("Sai mật khẩu, vui lòng kiểm tra lại!")
                const { password, ...result } = technician
                return result
            }
            case "regent": {
                const regent = await this.regentsRepository.findOne({
                    where: {
                        username: username,
                        active: true
                    },
                    select: ['id', 'username', 'email', 'password', "active", "image", "name", "phone", "role"],
                })
                if (!regent) throw new UnauthorizedException("Không tìm thấy thành viên ban quản trị đang hoạt động với tài khoản này, vui lòng kiểm tra lại!")
                const compare = await comparePassword(plainPassword, regent.password)
                if (!compare) throw new UnauthorizedException("Sai mật khẩu, vui lòng kiểm tra lại!")
                const { password, ...result } = regent
                return result
            }
            case "director": {
                const director = await this.directorsRepository.findOne({
                    where: {
                        username: username,
                        active: true
                    },
                    select: ['id', 'username', 'email', 'password', "active", "image", "name", "phone", "role"],
                })
                if (!director) throw new UnauthorizedException("Không tìm thấy trưởng ban quản lý đang hoạt động với tài khoản này, vui lòng kiểm tra lại!")
                const compare = await comparePassword(plainPassword, director.password)
                if (!compare) throw new UnauthorizedException("Sai mật khẩu, vui lòng kiểm tra lại!")
                const { password, ...result } = director
                return result
            }
            default: throw new BadRequestException("Không tìm thấy mã vai trò tương ứng!")
        }
    }

    async login(user: any) {
        const payload = { role: user.role, id: user.id };
        return {
            image: user.image,
            name: user.name,
            id: user.id,
            access_token: this.jwtService.sign(payload),
        }
    }

    async sendVerifyEmail(id: string, role: number) {
        const key = Object.keys(roles).find(key => roles[key] === role)
        if (!key) throw new BadRequestException("Không tìm thấy mã vai trò tương ứng!")
        switch (key) {
            case "owner": {
                const owner = await this.ownersRepository.findOne({
                    where: {
                        username: id,
                        active: true
                    },
                    select: ['id', 'email', "name", "active", "isVerify", "expiredAt", "verifyId"],
                })
                if (!owner) throw new BadRequestException("Không tìm thấy chủ hộ đang hoạt động với mã số này, vui lòng kiểm tra lại!")
                if (owner.isVerify) throw new BadRequestException("Tài khoản này đã được xác thực email!")
                if (owner.expiredAt && isAfter(owner.expiredAt, add(new Date(), { minutes: 3 }))) {
                    return {
                        message: `Mã xác thực đã được gửi tới email ${maskEmail(owner.email)} cách đây ít phút. Chưa thể gửi mã mới ngay. Vui lòng kiểm tra email gần nhất`,
                    }
                }
                const verifyId = generateSecureOtp()
                const update = await this.ownersRepository.update(owner.id, {
                    expiredAt: add(new Date(), { minutes: 5 }),
                    verifyId
                })
                if (update.affected === 0) throw new BadRequestException("Lỗi khi tạo mã xác thực!")

                this.mailerService
                    .sendMail({
                        to: owner.email,
                        subject: 'Xác nhận email tài khoản cư dân',
                        text: 'Welcome',
                        template: "verify",
                        context: {
                            name: owner.name,
                            verifyId
                        }
                    })
                    .then(() => { })
                    .catch(() => { });
                return {
                    message: `Mã xác thực đã được gửi tới email ${maskEmail(owner.email)}. Vui lòng kiểm tra và xác thực.`,
                }
            }
            case "tentant": {
                const tentant = await this.tentantsRepository.findOne({
                    where: {
                        username: id,
                        active: true
                    },
                    select: ['id', 'email', "name", "active", "isVerify", "expiredAt", "verifyId"],
                })
                if (!tentant) throw new BadRequestException("Không tìm thấy người thuê đang hoạt động với mã số này, vui lòng kiểm tra lại!")
                if (tentant.isVerify) throw new BadRequestException("Tài khoản này đã được xác thực email!")
                if (tentant.expiredAt && isAfter(tentant.expiredAt, add(new Date(), { minutes: 3 }))) {
                    return {
                        message: `Mã xác thực đã được gửi tới email ${maskEmail(tentant.email)} cách đây ít phút. Chưa thể gửi mã mới ngay. Vui lòng kiểm tra email gần nhất`,
                    }
                }
                const verifyId = generateSecureOtp()
                const update = await this.tentantsRepository.update(tentant.id, {
                    expiredAt: add(new Date(), { minutes: 5 }),
                    verifyId
                })
                if (update.affected === 0) throw new BadRequestException("Lỗi khi tạo mã xác thực!")

                this.mailerService
                    .sendMail({
                        to: tentant.email,
                        subject: 'Xác nhận email tài khoản cư dân',
                        text: 'Welcome',
                        template: "verify",
                        context: {
                            name: tentant.name,
                            verifyId
                        }
                    })
                    .then(() => { })
                    .catch(() => { });
                return {
                    message: `Mã xác thực đã được gửi tới email ${maskEmail(tentant.email)}. Vui lòng kiểm tra và xác thực.`,
                }
            }
            default: throw new BadRequestException("Không tìm thấy mã vai trò tương ứng!")
        }
    }

    async verifyEmail(id: string, role: number, otp: string) {
        const key = Object.keys(roles).find(key => roles[key] === role)
        if (!key) throw new BadRequestException("Không tìm thấy mã vai trò tương ứng!")
        switch (key) {
            case "owner": {
                const owner = await this.ownersRepository.findOne({
                    where: {
                        username: id,
                        active: true
                    },
                    select: ['id', 'email', 'password', "active", "image", "name", "phone", "role", "isVerify", "expiredAt", "verifyId"],
                })
                if (!owner) throw new BadRequestException("Không tìm thấy chủ hộ đang hoạt động với mã số này, vui lòng kiểm tra lại!")
                if (owner.isVerify) throw new BadRequestException("Tài khoản này đã được xác thực email!")
                if (otp !== owner.verifyId) throw new BadRequestException("Mã xác thực không chính xác!")
                if (owner.expiredAt === null || isBefore(owner.expiredAt, new Date())) throw new BadRequestException("Mã xác thực đã hết hạn!")

                const update = await this.ownersRepository.update(owner.id, { isVerify: true })
                if (update.affected === 0) throw new BadRequestException("Lỗi khi cập nhật xác thực!")
                return {
                    message: "Xác thực thành công, vui lòng đăng nhập lại",
                }
            }
            case "tentant": {
                const tentant = await this.tentantsRepository.findOne({
                    where: {
                        username: id,
                        active: true
                    },
                    select: ['id', 'email', 'password', "active", "image", "name", "phone", "role", "apartment", "isVerify", "expiredAt", "verifyId"],
                })
                if (!tentant) throw new BadRequestException("Không tìm thấy người thuê đang hoạt động với mã số này, vui lòng kiểm tra lại!")
                if (tentant.isVerify) throw new BadRequestException("Tài khoản này đã được xác thực email!")
                if (otp !== tentant.verifyId) throw new BadRequestException("Mã xác thực không chính xác!")
                if (tentant.expiredAt === null || isBefore(tentant.expiredAt, new Date())) throw new BadRequestException("Mã xác thực đã hết hạn!")

                const update = await this.tentantsRepository.update(tentant.id, { isVerify: true })
                if (update.affected === 0) throw new BadRequestException("Lỗi khi cập nhật xác thực!")
                return {
                    message: "Xác thực thành công, vui lòng đăng nhập lại",
                }
            }
            default: throw new BadRequestException("Không tìm thấy mã vai trò tương ứng!")
        }
    }

    async changePassword(id: string, role: number, newPassword: string, currentPassword: string) {
        const key = Object.keys(roles).find(key => roles[key] === role)
        if (!key) throw new BadRequestException("Không tìm thấy mã vai trò tương ứng!")
        switch (key) {
            case "owner": {
                const owner = await this.ownersRepository.findOne({
                    where: {
                        id: id,
                        active: true
                    },
                    select: ['password'],
                })
                if (!owner) throw new BadRequestException("Không tìm thấy chủ hộ đang hoạt động với mã số này, vui lòng kiểm tra lại!")
                const compare = await comparePassword(currentPassword, owner.password)
                if (!compare) throw new UnauthorizedException("Sai mật khẩu, vui lòng kiểm tra lại!")
                const hash = await hashPassword(newPassword)
                const update = await this.ownersRepository.update(id, { password: hash })
                if (update.affected === 0) throw new BadRequestException("Lỗi khi cập nhật mật khẩu!")
                return {
                    message: "Đổi mật khẩu thành công",
                }
            }
            case "tentant": {
                const tentant = await this.tentantsRepository.findOne({
                    where: {
                        id: id,
                        active: true
                    },
                    select: ['password'],
                })
                if (!tentant) throw new BadRequestException("Không tìm thấy người thuê đang hoạt động với mã số này, vui lòng kiểm tra lại!")
                const compare = await comparePassword(currentPassword, tentant.password)
                if (!compare) throw new UnauthorizedException("Sai mật khẩu, vui lòng kiểm tra lại!")
                const hash = await hashPassword(newPassword)
                const update = await this.tentantsRepository.update(id, { password: hash })
                if (update.affected === 0) throw new BadRequestException("Lỗi khi cập nhật mật khẩu!")
                return {
                    message: "Đổi mật khẩu thành công",
                }
            }
            default: throw new BadRequestException("Không tìm thấy mã vai trò tương ứng!")
        }
    }
}
