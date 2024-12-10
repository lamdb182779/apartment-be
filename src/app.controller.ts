import { Controller, Get, UseGuards, Request } from '@nestjs/common';

@Controller()
export class AppController {

  @Get('profile')
  getProfile(@Request() req) {
    const { createdAt, updatedAt, expiredAt, verifyId, isVerify, username, password, ...result } = req.user;
    return result;
  }
}
