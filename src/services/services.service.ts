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

  async findAll(current: number, pageSize: number) {
    current = (current && current > 0) ? current : 1
    pageSize = (pageSize && pageSize > 0) ? pageSize : 10

    const [services, count] = await this.servicesRepository.findAndCount({
      take: pageSize,
      skip: (current - 1) * pageSize,
      order: {
        createdAt: "ASC"
      },
      relations: ["apartment"],
    })
    return { results: services, totalPages: Math.ceil(count / pageSize) }
  }

  async findAllBySelf(user: any, current: number, pageSize: number) {
    current = (current && current > 0) ? current : 1
    pageSize = (pageSize && pageSize > 0) ? pageSize : 5
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
        const [services, count] = await this.servicesRepository.findAndCount({
          take: pageSize,
          skip: (current - 1) * pageSize,
          where: {
            apartment: {
              number: In(apartmentNumbers)
            }
          },
          relations: ["apartment"],
          order: {
            createdAt: "DESC"
          }
        })
        return {
          results: services.map(({ apartment, ...rest }) => { return { ...rest, apartment: apartment.number } }),
          totalPages: Math.ceil(count / pageSize)
        }
      }
      case "resident": {
        const resident = await this.residentsRepository.findOne({
          where: { id: user.id },
          relations: ["apartment"],
        })
        const apartmentNumber = resident.apartment.number
        const [services, count] = await this.servicesRepository.findAndCount({
          take: pageSize,
          skip: (current - 1) * pageSize,
          where: {
            apartment: {
              number: apartmentNumber
            }
          },
          relations: ["apartment"],
          order: {
            createdAt: "DESC"
          }
        })
        return {
          results: services.map(({ apartment, ...rest }) => { return { ...rest, apartment: apartment.number } }),
          totalPages: Math.ceil(count / pageSize)
        }
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

  async status(id: string, status: "Chờ xác nhận" | "Chấp thuận" | "Từ chối" | "Đã hủy", reason: string) {
    const service = await this.servicesRepository.update({
      id
    }, { status, rejectReason: reason })

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
