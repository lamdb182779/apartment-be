import { Controller, Get, UseGuards, Request, Patch, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('profile')
  getProfile(@Request() req) {
    const { createdAt, updatedAt, expiredAt, verifyId, isVerify, username, password, ...result } = req.user;
    return result;
  }

  @Patch('avatar')
  changeAvatar(@Request() req, @Body("image") image: string) {
    return this.appService.updateAvatar(req.user, image)
  }
}
