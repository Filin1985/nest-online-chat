import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecret',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: number }) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (token && (await this.userService.isTokenBlacklisted(token))) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    return user;
  }
}
