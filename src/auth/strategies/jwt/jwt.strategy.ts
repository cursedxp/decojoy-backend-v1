import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('AUTH0_CLIENT_SECRET'),
      audience: configService.get('AUTH0_CLIENT_ID'),
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
