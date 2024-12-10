import { Module } from '@nestjs/common';
import { AccountantsService } from './accountants.service';
import { AccountantsController } from './accountants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accountant } from './entities/accountant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Accountant])],
  controllers: [AccountantsController],
  providers: [AccountantsService],
})
export class AccountantsModule { }
