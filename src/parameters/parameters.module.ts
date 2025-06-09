import { Module } from '@nestjs/common';
import { ParametersService } from './parameters.service';
import { ParametersController } from './parameters.controller';
import { Parameter } from './entities/parameter.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Bill } from 'src/bills/entities/bill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parameter, Apartment, Bill])],
  controllers: [ParametersController],
  providers: [ParametersService],
})
export class ParametersModule { }
