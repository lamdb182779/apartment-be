import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { In, Repository } from 'typeorm';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Resident } from 'src/residents/entities/resident.entity';
import { roles } from 'src/helpers/utils';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,

    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>,

    @InjectRepository(Resident)
    private residentsRepository: Repository<Resident>
  ) { }
  async create(createServiceDto: CreateServiceDto) {
    const { number, type, area, startDate, endDate, reason } = createServiceDto
    const apartment = await this.apartmentsRepository.findOneBy({ number })
    const service = await this.servicesRepository.save(
      { type, area, startDate, endDate, reason, apartment }
    )
    return { message: 'Tạo yêu cầu thành công' };
  }

  findAll() {
    return `This action returns all services`;
  }

  async findAllByApartment(user: any) {
    const role = user.role
    const key = Object.keys(roles).find(key => roles[key] === role)
    switch (key) {
      case "owner": {
        const apartments = await this.apartmentsRepository.find({
          relations: ["owner"],
          where: { owner: { id: user.id } },
          select: ["number"],
        })
        const apartmentNumbers = apartments.map(apartment => apartment.number)
        const services = this.servicesRepository.find({
          where: {
            apartment: {
              number: In(apartmentNumbers)
            }
          },
          relations: ["apartment"]
        })
        return services
      }
      case "resident": {
        const resident = await this.residentsRepository.findOne({
          where: user,
          relations: ["apartment"],
        })
        const apartmentNumber = resident.apartment.number
        const services = this.servicesRepository.find({
          where: {
            apartment: {
              number: apartmentNumber
            }
          },
          relations: ["apartment"]
        })
        return services
      }
      default: throw new BadRequestException("Vai trò người dùng không phù hợp!")
    }
  }

  async findOne(id: string) {
    const service = await this.servicesRepository.findOne({
      where: {
        id
      },
      relations: ["apartment"]
    })
    return service;
  }

  async status(id: string, status: string) {
    const service = await this.servicesRepository.update({
      id
    }, { status })

    return { message: "Cập nhật thành công" };
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const { number, ...rest } = updateServiceDto
    const apartment = await this.apartmentsRepository.findOneBy({ number })
    const service = await this.servicesRepository.update({
      id
    }, { ...rest, apartment })

    return { message: "Cập nhật thành công" };
  }

  remove(id: string) {
    return `This action removes a #${id} service`;
  }
}
