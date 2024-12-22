import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { Apartment } from 'src/apartments/entities/apartment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bill, Apartment])],
  controllers: [BillsController],
  providers: [BillsService],
})
export class BillsModule { }
