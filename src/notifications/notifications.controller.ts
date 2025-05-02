import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Roles } from 'src/helpers/decorators';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Roles("manager", "receptionist")
  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Roles("manager", "receptionist")
  @Get()
  findAll(@Query() query: Record<string, string>) {
    const { current, pageSize } = query
    return this.notificationsService.findAll(+current, +pageSize);
  }

  @Roles("owner", "resident")
  @Get("self")
  findAllByUser(@Query() query: Record<string, string>, @Request() req) {
    const { current, pageSize } = query
    const user = req.user
    return this.notificationsService.findAllByUser(+current, +pageSize, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.notificationsService.findOne(id, req.user);
  }

  @Patch("readed")
  updateReaded(@Body() body, @Request() req) {
    return this.notificationsService.updateReaded(body.id, req.user)
  }

  @Patch("readedall")
  updateReadedAll(@Request() req) {
    return this.notificationsService.updateReadedAll(req.user)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
