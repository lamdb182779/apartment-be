import { Module } from '@nestjs/common';
import { RegentsService } from './regents.service';
import { RegentsController } from './regents.controller';

@Module({
  controllers: [RegentsController],
  providers: [RegentsService],
})
export class RegentsModule {}
