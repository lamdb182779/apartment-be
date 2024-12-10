import { Module } from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import { TechniciansController } from './technicians.controller';
import { Technician } from './entities/technician.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Technician])],
  controllers: [TechniciansController],
  providers: [TechniciansService],
})
export class TechniciansModule { }
