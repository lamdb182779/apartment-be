import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Resident } from 'src/residents/entities/resident.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Apartment, Resident])],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule { }
