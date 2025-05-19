import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Between, LessThan, Repository } from 'typeorm';
import { Bill } from './entities/bill.entity';
import { addDays, startOfDay } from 'date-fns';
import { roles } from 'src/helpers/utils';
import { Cron } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private billsRepository: Repository<Bill>,

    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>,

    private readonly mailerService: MailerService,

    private config: ConfigService
  ) { }

  @Cron('0 0 9 * * *')
  async handleCron() {
    const CLIENT_URL = this.config.get<string>('CLIENT_URL');
    const now = new Date()
    const afterAWeek = addDays(now, 7)
    const expiredBills = await this.billsRepository.find({
      where: {
        expired: LessThan(now)
      },
      relations: ["apartment", "apartment.owner", "apartment.residents"]
    })
    if (expiredBills?.length > 0) {
      expiredBills.forEach(({ apartment, id, amount, expired }) => {
        this.mailerService
          .sendMail({
            to: apartment.owner.email,
            subject: 'Thông báo hóa đơn đã quá hạn',
            text: 'Remind',
            template: "remind",
            context: {
              name: apartment.owner.name,
              type: "đã quá hạn",
              link: CLIENT_URL,
              id,
              amount,
              expired
            }
          })
          .then(() => { })
          .catch(() => { });
        if (apartment?.residents?.length > 0) {
          apartment.residents.forEach(({ email, name }) => {
            this.mailerService
              .sendMail({
                to: email,
                subject: 'Thông báo hóa đơn đã quá hạn',
                text: 'Remind',
                template: "remind",
                context: {
                  name: name,
                  type: "đã quá hạn",
                  link: CLIENT_URL,
                  id,
                  amount: amount.toLocaleString("vi"),
                  expired: expired.toLocaleString("vi")
                }
              })
              .then(() => { })
              .catch(() => { });
          })
        }
      })
    }

    const expiredSoonBills = await this.billsRepository.find({
      where: {
        expired: Between(now, afterAWeek)
      },
      relations: ["apartment", "apartment.owner", "apartment.residents"]
    })
    if (expiredSoonBills?.length > 0) {
      expiredSoonBills.forEach(({ apartment, id, amount, expired }) => {
        this.mailerService
          .sendMail({
            to: apartment.owner.email,
            subject: 'Thông báo hóa đơn sắp đến hạn',
            text: 'Remind',
            template: "remind",
            context: {
              name: apartment.owner.name,
              type: "sắp đến hạn",
              link: CLIENT_URL,
              id,
              amount,
              expired
            }
          })
          .then(() => { })
          .catch(() => { });
        if (apartment?.residents?.length > 0) {
          apartment.residents.forEach(({ email, name }) => {
            this.mailerService
              .sendMail({
                to: email,
                subject: 'Thông báo hóa đơn sắp đến hạn',
                text: 'Remind',
                template: "remind",
                context: {
                  name: name,
                  type: "sắp đến hạn",
                  link: CLIENT_URL,
                  id,
                  amount,
                  expired
                }
              })
              .then(() => { })
              .catch(() => { });
          })
        }
      })
    }
  }

  async create(createBillDto: CreateBillDto) {
    const { title, id, type, amount, content, number } = createBillDto
    const apartment = await this.apartmentsRepository.findOne({
      where: {
        number
      }
    })
    if (!apartment) throw new BadRequestException("Không tìm thấy số căn hộ!")
    const bill = await this.billsRepository.save({
      content,
      amount,
      ...(id && { id }),
      ...(title && { title }),
      ...(type && { type }),
      expired: addDays(startOfDay(new Date()), 15),
      apartment,
    })

    return { message: "Tạo hóa đơn thành công" }
  }

  async findAll(month: string, floor?: number) {
    const time = new Date(month)

    const bills = await this.billsRepository.find({
      where: {
        title: `Bảng phí dịch vụ, điện nước tháng ${month}`,
        apartment: {
          floor: floor || undefined
        }
      },
      relations: ["apartment"]
    })
    return bills.map(({ createdAt, updatedAt, ...bill }) => bill);
  }

  async findOne(id: string) {
    const bill = await this.billsRepository.findOne({
      where: {
        id
      }
    })
    if (!bill) throw new BadRequestException("Không tìm thấy mã hóa đơn này!")
    return bill;
  }

  async findSelfAll(id: string, role: number) {
    const key = Object.keys(roles).find(key => roles[key] === role)
    if (key !== "owner" && key !== "resident") throw new BadRequestException(["Không tìm thấy mã vai trò tương ứng!"])
    const apartments = await this.apartmentsRepository.find({
      where: {
        [key === "owner" ? key : "residents"]: {
          id,
          active: true
        }
      },
      relations: ["owner", "bills", "residents"],
    })
    if (apartments?.length === 0) throw new BadRequestException("Không tìm được chủ hộ đang hoạt động với mã số này!")
    return apartments.map(({ number, bills, ...apartment }) => { return { number, bills } });
  }

  async findByOwner(id: string) {
    const apartments = await this.apartmentsRepository.find({
      where: {
        owner: {
          id,
          active: true
        }
      },
      relations: ["owner", "bills"],
    })
    if (apartments?.length === 0) throw new BadRequestException("Không tìm được chủ hộ đang hoạt động với mã số này!")
    return apartments.map(({ number, bills, ...apartment }) => { return { number, bills } });
  }

  update(id: string, updateBillDto: UpdateBillDto) {
    return `This action updates a #${id} bill`;
  }

  remove(id: string) {
    return `This action removes a #${id} bill`;
  }
}
