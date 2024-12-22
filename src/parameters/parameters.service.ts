import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateParameterDto } from './dto/update-parameter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Parameter } from './entities/parameter.entity';
import { Between, Repository } from 'typeorm';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { format, isBefore, setDate, startOfMonth, subDays, subMonths } from 'date-fns';

@Injectable()
export class ParametersService {
  constructor(
    @InjectRepository(Parameter)
    private parametersRepository: Repository<Parameter>,

    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>
  ) { }
  async create() {
    const types = ["electric", "water"]
    const month = new Date("2024-05-25")
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

  findOne(id: string) {
    return `This action returns a #${id} parameter`;
  }

  async update(id: string, updateParameterDto: UpdateParameterDto, technician: any) {
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
    parameter.technician = technician
    await this.parametersRepository.save(parameter)
    return { message: "Cập nhật chỉ số thành công" };
  }

  remove(id: string) {
    return `This action removes a #${id} parameter`;
  }
}
