import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { Technician } from 'src/technicians/entities/technician.entity';
import { Accountant } from 'src/accountants/entities/accountant.entity';
import { Receptionist } from 'src/receptionists/entities/receptionist.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,

    @InjectRepository(Technician)
    private techniciansRepository: Repository<Technician>,

    @InjectRepository(Accountant)
    private accountantsRepository: Repository<Accountant>,

    @InjectRepository(Receptionist)
    private receptionistsRepository: Repository<Receptionist>,
  ) { }

  create(createTaskDto: CreateTaskDto) {
    return 'This action adds a new task';
  }

  async findAll(current: number, pageSize: number) {
    current = (current && current > 0) ? current : 1
    pageSize = (pageSize && pageSize > 0) ? pageSize : 10
    const [tasks, count] = await this.tasksRepository.findAndCount({
      take: pageSize,
      skip: (current - 1) * pageSize,
      order: {
        createdAt: "ASC"
      },
      relations: ["receptionist", "technician", "accountant"]
    })
    return { results: tasks, totalPages: Math.ceil(count / pageSize) }
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
