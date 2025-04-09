import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification, NotificationRead } from './entities/notification.entity';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Resident } from 'src/residents/entities/resident.entity';
import { Owner } from 'src/owners/entities/owner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, NotificationRead, Apartment, Resident, Owner])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule { }
