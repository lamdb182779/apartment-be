import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskUser } from './entities/task.entity';
import { Technician } from 'src/technicians/entities/technician.entity';
import { Accountant } from 'src/accountants/entities/accountant.entity';
import { Receptionist } from 'src/receptionists/entities/receptionist.entity';
import { roles } from 'src/helpers/utils';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,

    @InjectRepository(TaskUser)
    private taskUsersRepository: Repository<TaskUser>,

    @InjectRepository(Technician)
    private techniciansRepository: Repository<Technician>,

    @InjectRepository(Accountant)
    private accountantsRepository: Repository<Accountant>,

    @InjectRepository(Receptionist)
    private receptionistsRepository: Repository<Receptionist>,
  ) { }

  async create(createTaskDto: CreateTaskDto) {
    const { deadline, users, title, description } = createTaskDto
    const task = await this.tasksRepository.save({ deadline, title, description })
    if (!task) throw new BadRequestException(["Không thể tạo mới công việc!"])
    const errors = []
    const taskUsers = await Promise.all(
      users.map(async (user) => {
        const us = await this[`${user.role}sRepository`].findOne({
          where: {
            id: user.id,
            active: true
          }
        })
        if (!us) {
          errors.push(user.id)
          return null
        }
        return await this.taskUsersRepository.save({
          task: task,
          [user.role]: us,
        })
      })
    )
    const assignedUsers = taskUsers.filter(Boolean)
    return {
      message: "Giao công việc thành công"
    }
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
      relations: ["users", "users.receptionist", "users.technician", "users.accountant"]
    })
    return { results: tasks, totalPages: Math.ceil(count / pageSize) }
  }

  async findAllBySelf(current: number, pageSize: number, user) {
    current = (current && current > 0) ? current : 1
    pageSize = (pageSize && pageSize > 0) ? pageSize : 10
    const role = user.role
    const key = Object.keys(roles).find(key => roles[key] === role)
    const [taskUsers, count] = await this.taskUsersRepository.findAndCount({
      relations: [key, 'task'],
      where: {
        [key]: { id: user.id }
      },
      order: {
        createdAt: 'DESC',
      },
      take: pageSize,
    })

    return {
      results: taskUsers,
      totalPages: Math.ceil(count / pageSize)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  async complete(id: string, complete: boolean) {
    const update = await this.tasksRepository.update(id, { isComplete: complete })
    if (update.affected === 0) throw new BadRequestException(["Không thể cập nhật công việc này!"])
    return ({ message: "Cập nhật thành công" })
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const { deadline, users, title, description } = updateTaskDto
    const task = await this.tasksRepository.findOne({
      where: {
        id
      },
    })
    if (!task) throw new NotFoundException(["Không tìm thấy công việc với mã số này!"])
    const update = await this.tasksRepository.update(id, { deadline, title, description })
    if (update.affected === 0) throw new BadRequestException(["Không thể cập nhật công việc này!"])
    const curUsers = await this.taskUsersRepository.find({
      where: {
        task: { id: id },
      },
      relations: ["receptionist", "accountant", "technician"]
    })
    const taskUsers = await Promise.all(
      users.map(async (user) => {
        const us = await this[`${user.role}sRepository`].findOne({
          where: {
            id: user.id,
            active: true
          },
        })
        if (!us) {
          return null
        }
        if (curUsers.map(us => us[user.role]).some(item => item?.id === us.id)) return null
        return await this.taskUsersRepository.save({
          task: task,
          [user.role]: us,
        })
      })
    )
    const assignedUsers = taskUsers.filter(Boolean)
    return {
      message: "Cập nhật công việc thành công"
    }
  }

  async remove(id: string) {
    const del = await this.tasksRepository.delete(id)
    if (del.affected === 0) throw new BadRequestException(["Không thể xóa công việc với mã số này!"])
    return { message: "Xóa công việc thành công" };
  }
}
