import { Module } from '@nestjs/common';
import { RepliesService } from './replies.service';
import { RepliesController } from './replies.controller';
import { Comment } from 'src/comments/entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from './entities/reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Reply])],
  controllers: [RepliesController],
  providers: [RepliesService],
})
export class RepliesModule { }
