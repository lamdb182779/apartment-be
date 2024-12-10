import { BadRequestException, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const { username, password } = request.body;

        if (!username) {
            throw new BadRequestException('Tên đăng nhập không được để trống!');
        }

        if (!password) {
            throw new BadRequestException('Mật khẩu không được để trống!');
        }

        return super.canActivate(context) as Promise<boolean>;
    }
}