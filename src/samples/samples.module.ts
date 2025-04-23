import { Module } from '@nestjs/common';
import { SamplesService } from './samples.service';
import { SamplesController } from './samples.controller';
import { Sample } from './entities/sample.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Sample])],
  controllers: [SamplesController],
  providers: [SamplesService],
})
export class SamplesModule { }
