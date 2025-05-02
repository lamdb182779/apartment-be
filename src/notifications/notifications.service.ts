import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification, NotificationRead } from './entities/notification.entity';
import { In, IsNull, Not, Repository } from 'typeorm';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { roles } from 'src/helpers/utils';
import { Resident } from 'src/residents/entities/resident.entity';
import { intersection } from 'lodash'

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,

    @InjectRepository(NotificationRead)
    private notificationReadsRepository: Repository<NotificationRead>,

    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>,

    @InjectRepository(Resident)
    private residentsRepository: Repository<Resident>
  ) { }
  async create(createNotificationDto: CreateNotificationDto) {
    const { apartments, content, title, describe } = createNotificationDto
    const ownedApartments = await this.apartmentsRepository.find({
      where: {
        owner: Not(IsNull())
      }
    })
    const notiOwnedApartments = intersection(ownedApartments.map(apt => apt.number), apartments)
    const notification = await this.notificationsRepository.save({
      content,
      title,
      describe
    })
    const ownerIdsList = []
    if (notification) {
      const apartmentPromises = notiOwnedApartments.map(async (number) => {
        const apartment = await this.apartmentsRepository.findOne({
          where: {
            number,
          },
          relations: ["owner", "residents"]
        });

        if (apartment) {
          if (apartment.owner && !ownerIdsList.includes(apartment.owner.id)) {
            await this.notificationReadsRepository.save({
              owner: apartment.owner,
              notification
            }).then(() => {
              ownerIdsList.push(apartment.owner.id)
            })
          }
          if (apartment.residents?.length > 0) {
            const residentPromises = apartment.residents.map(async (resident) => {
              await this.notificationReadsRepository.save({
                resident: resident,
                notification
              })
            })
            await Promise.all(residentPromises)
          }
        }
      });

      await Promise.all(apartmentPromises);
    }
    return { message: 'Thông báo thành công' };
  }

  async findAll(current: number, pageSize: number) {
    current = (current && current > 0) ? current : 1
    pageSize = (pageSize && pageSize > 0) ? pageSize : 10

    const [notifications, count] = await this.notificationsRepository.findAndCount({
      take: pageSize,
      skip: (current - 1) * pageSize,
      order: {
        createdAt: "ASC"
      }
    })
    return { results: notifications, totalPages: Math.ceil(count / pageSize) }
  }

  async findAllByUser(current: number, pageSize: number, user: any) {
    current = (current && current > 0) ? current : 1
    pageSize = (pageSize && pageSize > 0) ? pageSize : 100
    const role = user.role
    const key = Object.keys(roles).find(key => roles[key] === role)
    switch (key) {
      case "owner": {
        const [notificationreads, count] = await this.notificationReadsRepository.findAndCount({
          relations: ['owner', 'notification'],
          where: {
            owner: { id: user.id }
          },
          order: {
            createdAt: 'DESC',
          },
          take: pageSize,
        })

        return {
          results: notificationreads.map(({ notification, isRead }) => { return { ...notification, isRead } }),
          totalPages: Math.ceil(count / pageSize)
        }
      }
      case "resident": {
        const [notificationreads, count] = await this.notificationReadsRepository.findAndCount({
          relations: ['resident', 'notification'],
          where: {
            resident: { id: user.id }
          },
          order: {
            createdAt: 'DESC',
          },
          take: pageSize,
        })
        return {
          results: notificationreads.map(({ notification, isRead }) => { return { ...notification, isRead } }),
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
      case "receptionist": {
        const notification = await this.notificationsRepository.findOne({
          where: { id },
        })
        return notification;
      }
      default: throw new BadRequestException("Vai trò người dùng không phù hợp!")
    }
  }

  async updateReaded(id: string, user: any) {
    const role = user.role
    const key = Object.keys(roles).find(key => roles[key] === role)
    switch (key) {
      case "owner": {
        const update = await this.notificationReadsRepository.update({
          notification: {
            id
          },
          owner: {
            id: user.id
          }
        },
          { isRead: true }
        )
        if (update.affected === 0) throw new BadRequestException("Thông báo không phù hợp đánh dấu đã đọc!")
        return { message: "Đánh dấu thông báo đã đọc" }
      }
      case "resident": {
        const update = await this.notificationReadsRepository.update({
          notification: {
            id
          },
          resident: {
            id: user.id
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
        const update = await this.notificationReadsRepository.update({
          owner: {
            id: user.id
          }
        },
          { isRead: true }
        )
        return { message: "Đánh dấu tất cả là đã đọc" }
      }
      case "resident": {
        const update = await this.notificationReadsRepository.update({
          resident: {
            id: user.id
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

  async remove(id: string) {
    const del = await this.notificationsRepository.delete(id)
    if (del.affected === 0) throw new BadRequestException(["Không thể xóa thông báo với mã số này!"])
    return { message: "Xóa thông báo thành công" };
  }
}
