import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Accountant } from 'src/accountants/entities/accountant.entity';
import { comparePassword, generateSecureOtp, getName, hashPassword, hasLetterNumber, maskEmail, roles } from 'src/helpers/utils';
import { Owner } from 'src/owners/entities/owner.entity';
import { Resident } from 'src/residents/entities/resident.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { add, isAfter, isBefore } from 'date-fns';
import { Receptionist } from 'src/receptionists/entities/receptionist.entity';
import { Technician } from 'src/technicians/entities/technician.entity';
import { Manager } from 'src/managers/entities/manager.entity';
import validator from 'validator';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

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

        @InjectRepository(Manager)
        private managersRepository: Repository<Manager>,

        @InjectRepository(Resident)
        private residentsRepository: Repository<Resident>,

        private jwtService: JwtService,

        private readonly mailerService: MailerService,

        private config: ConfigService

    ) { }

    async validateUser(username: string, plainPassword: string, role: number): Promise<any> {
        const key = Object.keys(roles).find(key => roles[key] === role)
        if (!key) throw new BadRequestException(["Không tìm thấy mã vai trò tương ứng!"])
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
            case "resident": {
                const resident = await this.residentsRepository.findOne({
                    where: {
                        username: username,
                        active: true
                    },
                    select: ['id', 'username', 'email', 'password', "active", "image", "name", "phone", "role", "apartment", "isVerify"],
                })
                if (!resident) throw new UnauthorizedException("Không tìm thấy cư dân đang hoạt động với tài khoản này, vui lòng kiểm tra lại!")
                const compare = await comparePassword(plainPassword, resident.password)
                if (!compare) throw new UnauthorizedException("Sai mật khẩu, vui lòng kiểm tra lại!")
                const { password, ...result } = resident
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
            case "manager": {
                const manager = await this.managersRepository.findOne({
                    where: {
                        username: username,
                        active: true
                    },
                    select: ['id', 'username', 'email', 'password', "active", "image", "name", "phone", "role"],
                })
                if (!manager) throw new UnauthorizedException("Không tìm thấy trưởng ban quản lý đang hoạt động với tài khoản này, vui lòng kiểm tra lại!")
                const compare = await comparePassword(plainPassword, manager.password)
                if (!compare) throw new UnauthorizedException("Sai mật khẩu, vui lòng kiểm tra lại!")
                const { password, ...result } = manager
                return result
            }
            default: throw new BadRequestException(["Không tìm thấy mã vai trò tương ứng!"])
        }
    }

    async login(user: any) {
        const payload = { role: user.role, id: user.id };
        return {
            image: user.image,
            name: user.name,
            id: user.id,
            role: user.role,
            access_token: this.jwtService.sign(payload),
        }
    }

    async sendVerifyEmail(id: string, role: number) {
        const CLIENT_URL = this.config.get<string>('CLIENT_URL');
        const key = Object.keys(roles).find(key => roles[key] === role)
        if (key !== "owner" && key !== "resident") throw new BadRequestException(["Không tìm thấy mã vai trò tương ứng!"])
        const user = await this[`${key}sRepository`].findOne({
            where: {
                username: id,
                active: true
            },
            select: ['id', 'email', "name", "active", "isVerify", "expiredAt", "verifyId"],
        })
        if (!user) throw new BadRequestException("Không tìm thấy chủ hộ đang hoạt động với mã số này, vui lòng kiểm tra lại!")
        if (user.isVerify) throw new BadRequestException("Tài khoản này đã được xác thực email!")
        if (user.expiredAt && isAfter(user.expiredAt, add(new Date(), { minutes: 3 }))) {
            throw new BadRequestException([`Mã xác thực đã được gửi tới email ${maskEmail(user.email)} cách đây ít phút. Chưa thể gửi mã mới ngay. Vui lòng kiểm tra email gần nhất!`])
        }
        const verifyId = generateSecureOtp()
        const update = await this[`${key}sRepository`].update(user.id, {
            expiredAt: add(new Date(), { minutes: 5 }),
            verifyId
        })
        if (update.affected === 0) throw new BadRequestException("Lỗi khi tạo mã xác thực!")

        this.mailerService
            .sendMail({
                to: user.email,
                subject: 'Xác nhận email tài khoản cư dân',
                text: 'Welcome',
                template: "verify",
                context: {
                    name: user.name,
                    verifyId,
                    link: CLIENT_URL
                }
            })
            .then(() => { })
            .catch(() => { });
        return {
            message: `Mã xác thực đã được gửi tới email ${maskEmail(user.email)}. Vui lòng kiểm tra và xác thực.`,
        }

    }

    async verifyEmail(id: string, role: number, otp: string) {
        const key = Object.keys(roles).find(key => roles[key] === role)
        if (!key) throw new BadRequestException(["Không tìm thấy mã vai trò tương ứng!"])
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
            case "resident": {
                const resident = await this.residentsRepository.findOne({
                    where: {
                        username: id,
                        active: true
                    },
                    select: ['id', 'email', 'password', "active", "image", "name", "phone", "role", "apartment", "isVerify", "expiredAt", "verifyId"],
                })
                if (!resident) throw new BadRequestException("Không tìm thấy cư dân đang hoạt động với mã số này, vui lòng kiểm tra lại!")
                if (resident.isVerify) throw new BadRequestException("Tài khoản này đã được xác thực email!")
                if (otp !== resident.verifyId) throw new BadRequestException("Mã xác thực không chính xác!")
                if (resident.expiredAt === null || isBefore(resident.expiredAt, new Date())) throw new BadRequestException("Mã xác thực đã hết hạn!")

                const update = await this.residentsRepository.update(resident.id, { isVerify: true })
                if (update.affected === 0) throw new BadRequestException("Lỗi khi cập nhật xác thực!")
                return {
                    message: "Xác thực thành công, vui lòng đăng nhập lại",
                }
            }
            default: throw new BadRequestException(["Không tìm thấy mã vai trò tương ứng!"])
        }
    }

    async changePassword(user, newPassword: string, currentPassword: string) {
        if (newPassword.length < 6) throw new BadRequestException(["Mật khẩu cần có ít nhất 6 ký tự!"])
        if (!hasLetterNumber(newPassword)) throw new BadRequestException(["Mật khẩu cần bao gồm cả chữ số và chữ cái!"])
        const key = Object.keys(roles).find(key => roles[key] === user.role)
        if (!key) throw new BadRequestException(["Không tìm thấy mã vai trò tương ứng!"])
        switch (key) {
            case "owner": {
                const owner = await this.ownersRepository.findOne({
                    where: {
                        id: user.id,
                        active: true
                    },
                    select: ['password'],
                })
                if (!owner) throw new BadRequestException("Không tìm thấy chủ hộ đang hoạt động với mã số này, vui lòng kiểm tra lại!")
                const compare = await comparePassword(currentPassword, owner.password)
                if (!compare) throw new UnauthorizedException("Sai mật khẩu, vui lòng kiểm tra lại!")
                const hash = await hashPassword(newPassword)
                const update = await this.ownersRepository.update(user.id, { password: hash })
                if (update.affected === 0) throw new BadRequestException("Lỗi khi cập nhật mật khẩu!")
                return {
                    message: "Đổi mật khẩu thành công",
                }
            }
            case "resident": {
                const resident = await this.residentsRepository.findOne({
                    where: {
                        id: user.id,
                        active: true
                    },
                    select: ['password'],
                })
                if (!resident) throw new BadRequestException("Không tìm thấy cư dân đang hoạt động với mã số này, vui lòng kiểm tra lại!")
                const compare = await comparePassword(currentPassword, resident.password)
                if (!compare) throw new UnauthorizedException("Sai mật khẩu, vui lòng kiểm tra lại!")
                const hash = await hashPassword(newPassword)
                const update = await this.residentsRepository.update(user.id, { password: hash })
                if (update.affected === 0) throw new BadRequestException("Lỗi khi cập nhật mật khẩu!")
                return {
                    message: "Đổi mật khẩu thành công",
                }
            }
            case "accountant": {
                const accountant = await this.accountantsRepository.findOne({
                    where: {
                        id: user.id,
                        active: true
                    },
                    select: ['password'],
                })
                if (!accountant) throw new BadRequestException("Không tìm thấy kế toán đang hoạt động với mã số này, vui lòng kiểm tra lại!")
                const compare = await comparePassword(currentPassword, accountant.password)
                if (!compare) throw new UnauthorizedException("Sai mật khẩu, vui lòng kiểm tra lại!")
                const hash = await hashPassword(newPassword)
                const update = await this.accountantsRepository.update(user.id, { password: hash })
                if (update.affected === 0) throw new BadRequestException("Lỗi khi cập nhật mật khẩu!")
                return {
                    message: "Đổi mật khẩu thành công",
                }
            }
            case "technician": {
                const technician = await this.techniciansRepository.findOne({
                    where: {
                        id: user.id,
                        active: true
                    },
                    select: ['password'],
                })
                if (!technician) throw new BadRequestException("Không tìm thấy Kỹ thuật viên đang hoạt động với mã số này, vui lòng kiểm tra lại!")
                const compare = await comparePassword(currentPassword, technician.password)
                if (!compare) throw new UnauthorizedException("Sai mật khẩu, vui lòng kiểm tra lại!")
                const hash = await hashPassword(newPassword)
                const update = await this.techniciansRepository.update(user.id, { password: hash })
                if (update.affected === 0) throw new BadRequestException("Lỗi khi cập nhật mật khẩu!")
                return {
                    message: "Đổi mật khẩu thành công",
                }
            }
            case "receptionist": {
                const receptionist = await this.receptionistsRepository.findOne({
                    where: {
                        id: user.id,
                        active: true
                    },
                    select: ['password'],
                })
                if (!receptionist) throw new BadRequestException("Không tìm thấy lễ tân đang hoạt động với mã số này, vui lòng kiểm tra lại!")
                const compare = await comparePassword(currentPassword, receptionist.password)
                if (!compare) throw new UnauthorizedException("Sai mật khẩu, vui lòng kiểm tra lại!")
                const hash = await hashPassword(newPassword)
                const update = await this.receptionistsRepository.update(user.id, { password: hash })
                if (update.affected === 0) throw new BadRequestException("Lỗi khi cập nhật mật khẩu!")
                return {
                    message: "Đổi mật khẩu thành công",
                }
            }
            case "manager": {
                const manager = await this.managersRepository.findOne({
                    where: {
                        id: user.id,
                        active: true
                    },
                    select: ['password'],
                })
                if (!manager) throw new BadRequestException("Không tìm thấy trưởng ban quản lý đang hoạt động với mã số này, vui lòng kiểm tra lại!")
                const compare = await comparePassword(currentPassword, manager.password)
                if (!compare) throw new UnauthorizedException("Sai mật khẩu, vui lòng kiểm tra lại!")
                const hash = await hashPassword(newPassword)
                const update = await this.managersRepository.update(user.id, { password: hash })
                if (update.affected === 0) throw new BadRequestException("Lỗi khi cập nhật mật khẩu!")
                return {
                    message: "Đổi mật khẩu thành công",
                }
            }
            default: throw new BadRequestException(["Không tìm thấy mã vai trò tương ứng!"])
        }
    }

    async changeUsername(user, newUsername: string) {
        const key = Object.keys(roles).find(key => roles[key] === user.role)
        if (!key) throw new BadRequestException(["Không tìm thấy mã vai trò tương ứng!"])
        const username = await this[`${key}sRepository`].findOne({
            where: {
                username: newUsername
            }
        })
        if (username) throw new BadRequestException(["Tên tài khoản đã tồn tại, vui lòng lựa chọn tên khác!"])
        const update = await this[`${key}sRepository`].update(user.id, { username: newUsername })
        if (update.affected === 0) throw new BadRequestException(["Không thể cập nhật tên tài khoản mới!"])
        return { message: "Cập nhật tên tài khoản mới thành công" }
    }

    async forgetUsername(email: string, id: number) {
        const CLIENT_URL = this.config.get<string>('CLIENT_URL');
        if (!validator.isEmail(email)) throw new BadRequestException(["Email phải đúng định dạng example@example"])
        const key = Object.keys(roles).find(key => roles[key] === id)
        if (!key) throw new BadRequestException(["Không tìm thấy mã vai trò tương ứng!"])
        const user = await this[`${key}sRepository`].findOne({
            where: {
                email
            }
        })
        if (!user) throw new BadRequestException(["Không tìm thấy người dùng, vui lòng kiểm tra lại email và vai trò!"])
        this.mailerService
            .sendMail({
                to: email,
                subject: 'Tên đăng nhập tài khoản',
                text: "Tài khoản",
                template: "fgusername",
                context: {
                    name: user.name,
                    username: user.username,
                    link: CLIENT_URL
                }
            })
            .then()
            .catch((e) => {
                console.log(e);
            });
        return {
            message: `Tên đăng nhập đã được gửi tới email ${maskEmail(user.email)}. Vui lòng kiểm tra.`,
        }
    }

    async sendLinkEmail(email: string, id: number) {
        const CLIENT_URL = this.config.get<string>('CLIENT_URL');
        const key = Object.keys(roles).find(key => roles[key] === id)
        if (!key) throw new BadRequestException(["Không tìm thấy mã vai trò tương ứng!"])
        if (!validator.isEmail(email)) throw new BadRequestException(["Email phải đúng định dạng example@example"])

        const user = await this[`${key}sRepository`].findOne({
            where: {
                email
            }
        })
        if (!user) throw new BadRequestException(["Không tìm thấy người dùng, vui lòng kiểm tra lại email và vai trò!"])
        const code = uuidv4()
        const hashCode = await hashPassword(code)
        user.resetCode = hashCode
        await this[`${key}sRepository`].save(user)
        this.mailerService
            .sendMail({
                to: email,
                subject: 'Đường dẫn đổi mật khẩu',
                text: "Bảo mật",
                template: "fgpassword",
                context: {
                    name: user.name,
                    link: `${CLIENT_URL}/reset?code=${code}&id=${user.id}&role=${user.role}`,
                    linkhome: CLIENT_URL
                }
            })
            .then()
            .catch((e) => {
                console.log(e);
            });
        return {
            message: `Link đổi mật khẩu đã được gửi tới email ${maskEmail(user.email)}. Vui lòng kiểm tra và đổi mật khẩu.`,
        }
    }

    async resetPassword(id: string, role: number, code: string, password: string) {
        if (password.length < 6) throw new BadRequestException(["Mật khẩu cần có ít nhất 6 ký tự!"])
        if (!hasLetterNumber(password)) throw new BadRequestException(["Mật khẩu cần bao gồm cả chữ số và chữ cái!"])
        const key = Object.keys(roles).find(key => roles[key] === role)
        if (!key) throw new BadRequestException(["Không tìm thấy mã vai trò tương ứng!"])
        const user = await this[`${key}sRepository`].findOne({
            where: {
                id
            },
            select: ["resetCode"]
        })
        if (!user?.resetCode) throw new UnauthorizedException(["Không thấy mã xác thực của tài khoản này!"])
        const compare = await comparePassword(code, user.resetCode)
        if (!compare) throw new UnauthorizedException(["Mã xác thực không chính xác!"])
        else {
            const hash = await hashPassword(password)
            await this[`${key}sRepository`].update(id, { resetCode: null, password: hash })
            return { message: "Cập nhật mật khẩu mới thành công" }
        }
    }
}

