import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification, NotificationApartment } from './entities/notification.entity';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Tenant } from 'src/tenants/entities/tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, NotificationApartment, Apartment, Tenant])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule { }
