import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true,
        });
    }

    async validate(req: any, username: string, password: string): Promise<any> {
        const role = req?.body?.role || 31
        const user = await this.authService.validateUser(username, password, +role)
        return user
    }
}