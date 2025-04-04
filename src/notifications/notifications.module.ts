import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification, NotificationApartment } from './entities/notification.entity';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Resident } from 'src/residents/entities/resident.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, NotificationApartment, Apartment, Resident])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule { }
