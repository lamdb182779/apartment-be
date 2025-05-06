import { Module } from '@nestjs/common';
import { VisitorsService } from './visitors.service';
import { VisitorsController } from './visitors.controller';
import { Visitor } from './entities/visitor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from 'src/apartments/entities/apartment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Visitor, Apartment])],
  controllers: [VisitorsController],
  providers: [VisitorsService],
})
export class VisitorsModule { }
