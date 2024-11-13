import { Module } from '@nestjs/common';
import { TentantsService } from './tentants.service';
import { TentantsController } from './tentants.controller';

@Module({
  controllers: [TentantsController],
  providers: [TentantsService],
})
export class TentantsModule {}
