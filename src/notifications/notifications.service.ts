import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification, NotificationApartment } from './entities/notification.entity';
import { In, Repository } from 'typeorm';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { roles } from 'src/helpers/utils';
import { Tenant } from 'src/tenants/entities/tenant.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,

    @InjectRepository(NotificationApartment)
    private notificationApartmentsRepository: Repository<NotificationApartment>,

    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>,

    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>
  ) { }
  async create(createNotificationDto: CreateNotificationDto) {
    const { apartments, content, title, describe } = createNotificationDto
    const notification = await this.notificationsRepository.save({
      content,
      title,
      describe
    })
    if (notification) {
      const apartmentPromises = apartments.map(async (number) => {
        const apartment = await this.apartmentsRepository.findOne({
          where: {
            number,
          }
        });

        if (apartment) {
          await this.notificationApartmentsRepository.save({
            apartment,
            notification
          });
        }
      });

      await Promise.all(apartmentPromises);
    }
    return { message: 'Thông báo thành công' };
  }

  async findAll(current: number, pageSize: number) {
    current = (current && current > 0) ? current : 1
    pageSize = (pageSize && pageSize > 0) ? pageSize : 10

    const [apartments, count] = await this.notificationsRepository.findAndCount({
      take: pageSize,
      skip: (current - 1) * pageSize,
      order: {
        createdAt: "ASC"
      }
    })
    return { results: apartments, totalPages: Math.ceil(count / pageSize) }
  }

  async findAllByUser(current: number, pageSize: number, user: any) {
    current = (current && current > 0) ? current : 1
    pageSize = (pageSize && pageSize > 0) ? pageSize : 100
    const role = user.role
    const key = Object.keys(roles).find(key => roles[key] === role)
    switch (key) {
      case "owner": {
        const apartments = await this.apartmentsRepository.find({
          relations: ["owner"],
          where: { owner: { id: user.id } },
          select: ["number"],
        })

        const apartmentNumbers = apartments.map(apartment => apartment.number)
        const [notifications, count] = await this.notificationsRepository.findAndCount({
          relations: ['apartments'],
          where: {
            apartments: {
              apartment: { number: In(apartmentNumbers) },
            },
          },
          order: {
            createdAt: 'DESC',
          },
          take: pageSize,
        })

        return {
          results: notifications.map(({ apartments, content, ...notification }) => { return { ...notification, isRead: apartments.some(({ isOwnerRead }) => isOwnerRead === true) } }),
          totalPages: Math.ceil(count / pageSize)
        }
      }
      case "tenant": {
        const tenant = await this.tenantsRepository.findOne({
          where: user,
          relations: ["apartment"],
        })
        const apartmentNumber = tenant.apartment.number
        const [notifications, count] = await this.notificationsRepository.findAndCount({
          relations: ['apartments'],
          where: {
            apartments: {
              apartment: { number: apartmentNumber },
            },
          },
          order: {
            createdAt: 'DESC',
          },
          take: pageSize,
        })
        return {
          results: notifications.map(({ apartments, content, ...notification }) => { return { ...notification, isRead: apartments.some(({ isRead }) => isRead === true) } }),
          totalPages: Math.ceil(count / pageSize)
        }
      }
      default: throw new BadRequestException("Vai trò người dùng không phù hợp!")
    }
  }

  async findOne(id: string, user: any) {
    const role = user.role
    const key = Object.keys(roles).find(key => roles[key] === role)

    switch (key) {
      case "owner": {
        const apartments = await this.apartmentsRepository.find({
          relations: ["owner"],
          where: { owner: { id: user.id } },
          select: ["number"],
        })

        const apartmentNumbers = apartments.map(apartment => apartment.number)
        const notification = await this.notificationsRepository.findOne({
          where: {
            id,
            apartments: {
              apartment: {
                number: In(apartmentNumbers)
              }
            }
          },
          relations: ["apartments"]
        })
        return notification;
      }
      case "tenant": {
        const tenant = await this.tenantsRepository.findOne({
          where: user,
          relations: ["apartment"],
        })
        const apartmentNumber = tenant.apartment.number
        const notification = await this.notificationsRepository.findOne({
          relations: ['apartments'],
          where: {
            apartments: {
              apartment: { number: apartmentNumber },
            },
          },
        })
        return notification
      }
      default: throw new BadRequestException("Vai trò người dùng không phù hợp!")
    }
  }

  async updateReaded(id: string, user: any) {
    const role = user.role
    const key = Object.keys(roles).find(key => roles[key] === role)
    switch (key) {
      case "owner": {
        const apartments = await this.apartmentsRepository.find({
          relations: ["owner"],
          where: { owner: { id: user.id } },
          select: ["number"],
        })

        const apartmentNumbers = apartments.map(apartment => apartment.number)
        const update = await this.notificationApartmentsRepository.update({
          notification: {
            id
          },
          apartment: {
            number: In(apartmentNumbers)
          }
        },
          { isOwnerRead: true }
        )
        if (update.affected === 0) throw new BadRequestException("Thông báo không phù hợp đánh dấu đã đọc!")
        return { message: "Đánh dấu thông báo đã đọc" }
      }
      case "tenant": {
        const tenant = await this.tenantsRepository.findOne({
          where: user,
          relations: ["apartment"],
        })
        const apartmentNumber = tenant.apartment.number
        const update = await this.notificationApartmentsRepository.update({
          notification: {
            id
          },
          apartment: {
            number: apartmentNumber
          }
        },
          { isRead: true }
        )
        if (update.affected === 0) throw new BadRequestException("Thông báo không phù hợp đánh dấu đã đọc!")
        return { message: "Đánh dấu thông báo đã đọc" }
      }
      default: throw new BadRequestException("Vai trò người dùng không phù hợp!")
    }
  }

  async updateReadedAll(user: any) {
    const role = user.role
    const key = Object.keys(roles).find(key => roles[key] === role)
    switch (key) {
      case "owner": {
        const apartments = await this.apartmentsRepository.find({
          relations: ["owner"],
          where: { owner: { id: user.id } },
          select: ["number"],
        })

        const apartmentNumbers = apartments.map(apartment => apartment.number)
        const update = await this.notificationApartmentsRepository.update({
          apartment: {
            number: In(apartmentNumbers)
          }
        },
          { isOwnerRead: true }
        )
        return { message: "Đánh dấu tất cả là đã đọc" }
      }
      case "tenant": {
        const tenant = await this.tenantsRepository.findOne({
          where: user,
          relations: ["apartment"],
        })
        const apartmentNumber = tenant.apartment.number
        const update = await this.notificationApartmentsRepository.update({
          apartment: {
            number: apartmentNumber
          }
        },
          { isRead: true }
        )
        return { message: "Đánh dấu tất cả là đã đọc" }
      }
      default: throw new BadRequestException("Vai trò người dùng không phù hợp!")
    }
  }

  update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: string) {
    return `This action removes a #${id} notification`;
  }
}
