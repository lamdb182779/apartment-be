import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Repository } from 'typeorm';
import { Bill } from './entities/bill.entity';
import { addDays, startOfDay } from 'date-fns';
import { roles } from 'src/helpers/utils';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private billsRepository: Repository<Bill>,

    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>
  ) { }
  async create(createBillDto: CreateBillDto) {
    const { title, id, type, amount, content, number } = createBillDto
    const apartment = await this.apartmentsRepository.findOne({
      where: {
        number
      }
    })
    if (!apartment) throw new BadRequestException("Không tìm thấy số căn hộ!")
    apartment.debt = apartment.debt + amount
    const update = await this.apartmentsRepository.save(apartment)
    if (update.debt !== apartment.debt) throw new BadRequestException("Không cập nhật được tổng tiền thanh toán của căn hộ!")
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
