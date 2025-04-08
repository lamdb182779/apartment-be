import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Apartment } from './entities/apartment.entity';
import { Between, Repository } from 'typeorm';
import { addMonths, isBefore, setDate, startOfMonth, subDays, subMonths } from 'date-fns';
import { Room } from 'src/rooms/entities/room.entity';

@Injectable()
export class ApartmentsService {
  constructor(
    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>,

    @InjectRepository(Room)
    private roomsRepository: Repository<Room>
  ) { }
  create(createApartmentDto: CreateApartmentDto) {
    return 'This action adds a new apartment';
  }

  async findAll(filter: Record<string, string>, current: number, pageSize: number, orderBy: string) {
    current = (current && current > 0) ? current : 1
    pageSize = (pageSize && pageSize > 0) ? pageSize : 10
    orderBy = (orderBy === "ASC") ? orderBy : "DESC"

    const [apartments, count] = await this.apartmentsRepository.findAndCount({
      where: filter,
      select: ["number", "acreage", "floor", "axis", "owner"],
      take: pageSize,
      skip: (current - 1) * pageSize,
      order: {
        number: orderBy as any
      }
    })
    return { results: apartments, totalPages: Math.ceil(count / pageSize) }
  }

  async findAllNumber() {
    const apartments = await this.apartmentsRepository.find()
    return apartments.map(({ number }) => number)
  }

  async findOne(number: number) {
    const now = new Date()
    const apartment = await this.apartmentsRepository.findOne({
      where: {
        number,
        parameters: {
          month: Between(subMonths(now, 6), now),
        },
      },
      relations: ["parameters", "residents", "rooms"]
    })
    const { updatedAt, createdAt, parameters, residents, rooms, ...result } = apartment
    return {
      ...result, parameters: parameters.reduce((acc, parameter) => {
        if (parameter.type === "electric") {
          acc.electric.push(parameter);
        } else if (parameter.type === "water") {
          acc.water.push(parameter);
        }
        return acc
      }, { electric: [], water: [] }),
      residents: residents.map(({ name, active }) => active ? name : null).filter(Boolean),
      rooms: rooms.map(({ createdAt, updatedAt, ...room }) => room)
    }
  }

  async findOwnerless() {
    const apartments = await this.apartmentsRepository
      .createQueryBuilder('apartment')
      .where(`apartment.owner IS NULL`)
      .getMany()
    return apartments.map(({ updatedAt, createdAt, ...apartment }) => apartment)
  }

  async findOwnered(floor?: number) {
    const query = this.apartmentsRepository
      .createQueryBuilder('apartment')
      .where('apartment.owner IS NOT NULL');

    if (floor) {
      query.andWhere('apartment.floor = :floor', { floor });
    }

    const apartments = await query.getMany()
    return apartments.map(({ updatedAt, createdAt, ...apartment }) => apartment)
  }

  async checkOwnered(number: number) {
    if (!number || isNaN(number)) throw new BadRequestException("Không rõ số nhà!")
    const apartment = await this.apartmentsRepository.findOne({
      where: {
        number
      },
      select: ["owner"],
      relations: ["owner"]
    })
    return apartment.owner.name
  }
  async tenantLooking() {
    const rentalaApt = await this.apartmentsRepository.find({
      where: {
        tenantLooking: true
      },
      relations: ["rooms", "owner"]
    })
    return rentalaApt
  }

  async findNearest(number: number, time: string) {
    if (!number || isNaN(number)) throw new BadRequestException("Không rõ số nhà!")
    const date = new Date(time)
    let current25th = setDate(date, 25);
    if (isBefore(date, current25th)) {
      current25th = setDate(subDays(current25th, 1), 25);
    }
    const apartment = await this.apartmentsRepository.findOne({
      where: {
        number,
        parameters: {
          month: Between(subMonths(current25th, 2), current25th)
        }
      },
      relations: ["parameters"]
    })

    return apartment.parameters.reduce(
      (acc, item) => {
        if (item.type === "electric") {
          acc.electric.push(item.value);
        } else if (item.type === "water") {
          acc.water.push(item.value);
        }
        return acc;
      },
      { electric: [] as number[], water: [] as number[], acreage: apartment.acreage, debt: apartment.debt }
    )
  }

  update(number: number, updateApartmentDto: UpdateApartmentDto) {
    return `This action updates a #${number} apartment`;
  }

  async rentalInfo(number: number, updateRentalInfo) {
    const { adTitle, rentPrice, advertisement, image, rooms } = updateRentalInfo
    if (!number || isNaN(number)) throw new BadRequestException("Không rõ số căn hộ!")
    const apartment = await this.apartmentsRepository.findOne({ where: { number }, relations: ["rooms"] })
    if (!apartment) throw new Error('Không tìm thấy căn hộ này!')
    const roomErrors = []
    const errors = []
    for (const room of rooms) {
      if (room.id && apartment.rooms.some(item => item.id === room.id)) {
        const { id, ...rest } = room
        const updateRoom = await this.roomsRepository.update(id, rest)
        if (updateRoom.affected === 0) roomErrors.push("change")
      }
      else {
        const newRoom = await this.roomsRepository.save({
          image: room.image,
          name: room.name,
          type: room.type,
          acreage: room.acreage
        })
        if (newRoom) {
          newRoom.apartment = apartment
          await this.roomsRepository.save(newRoom)
        } else roomErrors.push("add")
      }
    }
    for (const room of apartment.rooms) {
      if (!rooms.some(item => item.id === room.id)) {
        const del = await this.roomsRepository.delete(room.id)
        if (del.affected === 0) roomErrors.push("delete")
      }
    }
    const update = await this.apartmentsRepository.update(number, {
      adTitle, image, rentPrice, advertisement
    })
    if (roomErrors.includes("add")) errors.push("Lỗi khi thêm một số phòng!")
    if (roomErrors.includes("change")) errors.push("Lỗi khi sửa một số phòng!")
    if (roomErrors.includes("delete")) errors.push("Lỗi khi xóa một số phòng!")
    if (update.affected === 0) errors.push("Không thể cập nhật thông tin tổng quan!")
    if (errors.length > 0) throw new BadRequestException(errors)
    return { message: "Cập nhật thành công" }
  }

  async changeTenantLooking(number: number) {
    if (!number || isNaN(number)) throw new BadRequestException("Không rõ số căn hộ!")
    const apartment = await this.apartmentsRepository.findOneBy({ number })
    if (!apartment) throw new Error('Không tìm thấy căn hộ này!')
    const update = await this.apartmentsRepository.update(number, { tenantLooking: !apartment.tenantLooking })
    if (update.affected === 0) throw new BadRequestException("Đổi trạng thái trạng thái của căn hộ thất bại!")
    return { message: "Đổi trạng thái thành công" }
  }

  remove(number: number) {
    return `This action removes a #${number} apartment`;
  }
}
