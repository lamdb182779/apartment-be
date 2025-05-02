import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resident } from 'src/residents/entities/resident.entity';
import { Owner } from 'src/owners/entities/owner.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Resident, Owner])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule { }
