import { Controller, Post, UseGuards, Request, Get, Response, Query, Body, Patch, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from 'src/helpers/decorators';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        if (req.user.isVerify === false)
            throw new UnauthorizedException("Tài khoản này chưa được xác thực!")
        return this.authService.login(req.user)
    }

    @Public()
    @Patch("send")
    async getVerifyEmail(@Body() body: { id: string, role: string }) {
        const { id, role } = body
        return this.authService.sendVerifyEmail(id, +role)
    }

    @Public()
    @Patch("verify")
    async verifyEmail(@Body() body: { id: string, role: string, otp: string }) {
        const { id, role, otp } = body
        return this.authService.verifyEmail(id, +role, otp)
    }

    @Public()
    @Post("forgetUn")
    async forgetUsername(@Body("email") email: string, @Body("id") id: string) {
        return this.authService.forgetUsername(email, +id)
    }

    @Public()
    @Patch("reset")
    async sendLinkEmail(@Body("email") email: string, @Body("id") id: string) {
        return this.authService.sendLinkEmail(email, +id)
    }

    @Public()
    @Patch("resetPw")
    async resetPassword(@Body("role") role: string, @Body("id") id: string, @Body("code") code: string, @Body("password") password: string) {
        return this.authService.resetPassword(id, +role, code, password)
    }

    @Patch("changePw")
    async changePassword(@Body() body: { newPassword: string, currentPassword: string }, @Request() req) {
        const { newPassword, currentPassword } = body
        return this.authService.changePassword(req.user, newPassword, currentPassword)
    }

    @Patch("changeUn")
    async changeUsername(@Body("newUsername") newUsername: string, @Request() req) {
        return this.authService.changeUsername(req.user, newUsername)
    }
}
