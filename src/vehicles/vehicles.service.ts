import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { roles } from 'src/helpers/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Owner } from 'src/owners/entities/owner.entity';
import { And, IsNull, Not, Or, Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Resident } from 'src/residents/entities/resident.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,

    @InjectRepository(Owner)
    private ownersRepository: Repository<Owner>,

    @InjectRepository(Resident)
    private residentsRepository: Repository<Resident>
  ) { }
  async create(createVehicleDto: CreateVehicleDto) {
    const { name, image, roleId, type, ownerId } = createVehicleDto
    const key = Object.keys(roles).find(key => roles[key] === roleId)
    const owner = await this[`${key}sRepository`].findOneBy({ id: ownerId })
    if (!owner) throw new NotFoundException(["Không tìm thấy mã chủ xe này!"])
    const vehicle = await this.vehiclesRepository.save({ name, image, type, [key]: owner })
    if (!vehicle) throw new BadRequestException(["Lỗi khi thêm mới thông tin xe!"])
    return { message: "Thêm mới thông tin xe thành công" };
  }

  async findAll(current: number, pageSize: number) {
    current = (current && current > 0) ? current : 1
    pageSize = (pageSize && pageSize > 0) ? pageSize : 5
    const [vehicles, count] = await this.vehiclesRepository.findAndCount({
      take: pageSize,
      skip: (current - 1) * pageSize,
      order: {
        createdAt: "ASC"
      },
      where: [
        {
          owner: IsNull(),
          resident: { active: true },
        },
        {
          resident: IsNull(),
          owner: { active: true },
        }
      ],
      relations: ["owner", "resident", "resident.apartment"]
    })
    return { results: vehicles, totalPages: Math.ceil(count / pageSize) }
  }

  async findAllByUser(ownerId: string, roleId: number) {
    const key = Object.keys(roles).find(key => roles[key] === roleId)
    const vehicles = await this.vehiclesRepository.find({
      where: {
        [key]: { id: ownerId }
      },
    })
    return vehicles
  }

  findOne(id: number) {
    return `This action returns a #${id} vehicle`;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    const update = await this.vehiclesRepository.update(id, updateVehicleDto)
    if (update.affected === 0) throw new BadRequestException(["Không thể cập nhật thông tin xe!"])
    return ({ message: "Cập nhật thông tin xe thành công" })
  }

  async remove(id: string) {
    const del = await this.vehiclesRepository.delete(id)
    if (del.affected === 0) throw new BadRequestException(["Không thể xóa thông tin xe!"])
    return ({ message: "Xóa thông tin xe thành công" })
  }
}
