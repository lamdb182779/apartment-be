import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Owner } from 'src/owners/entities/owner.entity';
import { Resident } from 'src/residents/entities/resident.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Resident, Owner])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule { }
