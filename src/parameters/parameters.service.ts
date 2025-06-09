import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateParameterDto } from './dto/update-parameter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Parameter } from './entities/parameter.entity';
import { Between, In, Repository } from 'typeorm';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { endOfMonth, format, isBefore, setDate, startOfMonth, subDays, subMonths } from 'date-fns';
import { Cron } from '@nestjs/schedule';
import { Bill } from 'src/bills/entities/bill.entity';

@Injectable()
export class ParametersService {
  constructor(
    @InjectRepository(Parameter)
    private parametersRepository: Repository<Parameter>,

    @InjectRepository(Bill)
    private billsRepository: Repository<Bill>,

    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>
  ) { }

  @Cron('0 0 0 25 * *')
  async handleCron() {
    const types = ["electric", "water"]
    const month = new Date()
    const apartments = await this.apartmentsRepository
      .createQueryBuilder('apartment')
      .where(`apartment.owner IS NOT NULL`)
      .getMany()
    const errors = []
    for (const type of types) {
      for (const apartment of apartments) {
        const parameter = await this.parametersRepository.save({
          apartment,
          month,
          type,
        })
        if (!parameter) errors.push({ number: apartment.number, type })
      }
    }
    const elecErrors = errors.filter(err => err.type === "electric").map(err => err.number)
    const waterErrors = errors.filter(err => err.type === "water").map(err => err.number)
    if (errors.length > 0) throw new BadRequestException([
      elecErrors.length > 0 && `Không thể thêm chỉ số điện cho căn hộ ${elecErrors.join(", ")}!`,
      waterErrors.length > 0 && `Không thể thêm chỉ số điện cho căn hộ ${waterErrors.join(", ")}!`,
    ])
    return { message: "Cập nhật thành công" }
  }

  async create() {
  }

  async findAll(time: string, floor: number) {
    const preParaDate = isBefore(new Date(), setDate(startOfMonth(new Date()), 25)) ? setDate(startOfMonth(subMonths(new Date(), 1)), 25) : setDate(startOfMonth(new Date()), 25)
    const month = (new Date(time)).getDate() === 25 ? new Date(time) : preParaDate
    const parameters = await this.parametersRepository.find({
      where: {
        month,
        apartment: {
          floor
        }
      },
      relations: ["apartment"]
    })
    return parameters.map(({ createdAt, updatedAt, ...parameter }) => parameter).map(({ apartment, ...parameter }) => { return { ...parameter, number: apartment.number } }).reduce((acc, parameter) => {
      if (!acc[parameter.number]) {
        acc[parameter.number] = []
      }
      acc[parameter.number].push(parameter)
      return acc
    }, []).filter(Boolean);
  }

  async findAllMonthBill(time: string, floor: number) {
    const preParaDate = isBefore(new Date(), setDate(startOfMonth(new Date()), 25)) ? setDate(startOfMonth(subMonths(new Date(), 1)), 25) : setDate(startOfMonth(new Date()), 25)
    const month = (new Date(time)).getDate() === 25 ? new Date(time) : preParaDate
    const parameters = await this.parametersRepository.find({
      where: {
        month,
        apartment: {
          floor,
        }
      },
      relations: ["apartment"],
    })

    const grouped = parameters.reduce((acc, para) => {
      const number = para.apartment.number;
      if (!acc[number]) acc[number] = [];
      acc[number].push(para);
      return acc;
    }, {} as Record<number, typeof parameters>);

    const results = await Promise.all(
      Object.entries(grouped).map(async ([numberStr, paras]) => {
        const number = parseInt(numberStr);
        const apartmentNumber = paras[0].apartment.number;

        const billsExist = await this.billsRepository.exists({
          where: {
            apartment: { number: apartmentNumber },
            title: `Hóa đơn dịch vụ điện nước tháng ${format(month, "MM/yyyy")}`,
            type: "Dịch vụ hàng tháng",
          },
        });

        const electric = paras.find((p) => p.type === "electric")?.value ?? null;
        const water = paras.find((p) => p.type === "water")?.value ?? null;

        return {
          number,
          hasBill: billsExist,
          electric,
          water,
        };
      })
    );
    return results;
  }

  async findNearest(number: number, time: string) {
    if (!number || isNaN(number)) throw new BadRequestException("Không rõ số nhà!")
    const date = new Date(time)
    let current25th = setDate(date, 25);
    if (isBefore(date, current25th)) {
      current25th = setDate(subDays(current25th, 1), 25);
    }
    const parameters = await this.parametersRepository.find({
      where: {
        month: In([current25th, subMonths(current25th, 1)]),
        apartment: {
          number
        }
      },
    })

    const res = ['electric', 'water'].reduce((acc, type) => {
      const [cur, pre] = parameters
        .filter(p => p.type === type)
        .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime())
        .map(p => p.value);

      acc[type] = { cur, pre };
      return acc;
    }, {} as Record<string, { cur: number, pre: number }>)
    return res
  }

  findOne(id: string) {
    return `This action returns a #${id} parameter`;
  }

  async update(id: string, updateParameterDto: UpdateParameterDto) {
    const { value } = updateParameterDto
    const parameter = await this.parametersRepository.findOne({
      where: {
        id
      },
      relations: ["apartment"]
    })
    const preMonthPara = await this.parametersRepository.findOne({
      where: {
        apartment: parameter.apartment,
        month: subMonths(parameter.month, 1)
      },
      relations: ["apartment"]
    })
    if (preMonthPara?.value > value) throw new BadRequestException(`Chỉ số tháng trước là ${preMonthPara.value}, không thể nhập thấp hơn!`)
    parameter.value = value
    await this.parametersRepository.save(parameter)
    return { message: "Cập nhật chỉ số thành công" };
  }

  remove(id: string) {
    return `This action removes a #${id} parameter`;
  }
}
