import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Bill } from 'src/bills/entities/bill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Bill])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule { }
