import { Module } from '@nestjs/common';
import { TentantsService } from './tentants.service';
import { TentantsController } from './tentants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tentant } from './entities/tentant.entity';
import { Apartment } from 'src/apartments/entities/apartment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tentant, Apartment])],
  controllers: [TentantsController],
  providers: [TentantsService],
})
export class TentantsModule { }
