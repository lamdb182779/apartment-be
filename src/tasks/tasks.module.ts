import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task, TaskUser } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receptionist } from 'src/receptionists/entities/receptionist.entity';
import { Accountant } from 'src/accountants/entities/accountant.entity';
import { Technician } from 'src/technicians/entities/technician.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskUser, Receptionist, Accountant, Technician])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule { }
