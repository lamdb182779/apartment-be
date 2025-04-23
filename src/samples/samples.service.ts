import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSampleDto } from './dto/create-sample.dto';
import { UpdateSampleDto } from './dto/update-sample.dto';
import { Sample } from './entities/sample.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SamplesService {
  constructor(
    @InjectRepository(Sample)
    private samplesRepository: Repository<Sample>,
  ) { }

  async create(createSampleDto: CreateSampleDto) {
    const { name, describe } = createSampleDto
    const sample = await this.samplesRepository.save({
      name,
      describe
    })
    return { message: "Tạo mẫu yêu cầu thành công" }
  }

  async find() {
    const samples = await this.samplesRepository.find()
    return samples
  }

  async findAll(current: number, pageSize: number) {
    current = (current && current > 0) ? current : 1
    pageSize = (pageSize && pageSize > 0) ? pageSize : 10

    const [samples, count] = await this.samplesRepository.findAndCount({
      take: pageSize,
      skip: (current - 1) * pageSize,
      order: {
        createdAt: "ASC"
      },
    })
    return { results: samples, totalPages: Math.ceil(count / pageSize) }
  }

  findOne(id: number) {
    return `This action returns a #${id} sample`;
  }

  async update(id: string, updateSampleDto: UpdateSampleDto) {
    const { name, describe } = updateSampleDto
    const update = await this.samplesRepository.update(id, updateSampleDto)
    if (update.affected === 0) throw new BadRequestException(["Cập nhật thất bại!"])
    return { message: "Cập nhật thành công" };
  }

  async remove(id: string) {
    const del = await this.samplesRepository.delete(id)
    if (del.affected === 0) throw new BadRequestException(["Xóa thất bại!"])
    return { message: "Xóa thành công" };
  }
}
