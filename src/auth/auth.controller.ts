import { Controller, Post, UseGuards, Request, Get, Response, Query, Body, Patch } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from 'src/helpers/decorators';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        if (req.user.isVerify === false) return {
            message: "Tài khoản này chưa được xác thực!",
            id: req.user.id
        }
        return this.authService.login(req.user)
    }

    @Public()
    @Patch("/send")
    async getVerifyEmail(@Body() body: { id: string, role: string, otp: string }) {
        const { id, role } = body
        return this.authService.sendVerifyEmail(id, +role)
    }

    @Public()
    @Patch("/verify")
    async verifyEmail(@Body() body: { id: string, role: string, otp: string }) {
        const { id, role, otp } = body
        return this.authService.verifyEmail(id, +role, otp)
    }

    @Patch("/change")
    async changePassword(@Body() body: { id: string, role: string, newPassword: string, currentPassword: string }) {
        const { id, role, newPassword, currentPassword } = body
        return this.authService.changePassword(id, +role, newPassword, currentPassword)
    }
}
