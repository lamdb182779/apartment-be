
import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/helpers/decorators';
import { roles } from 'src/helpers/utils';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        const can = (await super.canActivate(context)) as boolean;

        if (!can) return false;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (requiredRoles && requiredRoles.length > 0) {
            const hasRole = requiredRoles.some((role) => Object.keys(roles).find(key => roles[key] === user.role) === role);
            if (!hasRole) {
                throw new ForbiddenException(['Bạn không có quyền truy cập hay thực hiện hành động này!']);
            }
        }

        return true;
    }

    handleRequest(err, user, info) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException("Người dùng không hợp lệ!");
        }
        return user;
    }
}
