import { Module } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { OwnersController } from './owners.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './entities/owner.entity';
import { Apartment } from 'src/apartments/entities/apartment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Owner, Apartment])],
  controllers: [OwnersController],
  providers: [OwnersService],
})
export class OwnersModule { }
