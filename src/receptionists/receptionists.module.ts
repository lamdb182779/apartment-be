import { Module } from '@nestjs/common';
import { ReceptionistsService } from './receptionists.service';
import { ReceptionistsController } from './receptionists.controller';
import { Receptionist } from './entities/receptionist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Receptionist])],
  controllers: [ReceptionistsController],
  providers: [ReceptionistsService],
})
export class ReceptionistsModule { }
