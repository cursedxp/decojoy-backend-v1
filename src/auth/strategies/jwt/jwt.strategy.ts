import { Injectable } from '@nestjs/common';
import * as jwksRsa from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${configService.get(
          'AUTH0_DOMAIN',
        )}/.well-known/jwks.json`,
      }),
      audience: configService.get('AUTH0_API_AUDIENCE'),
      issuer: configService.get('AUTH0_ISSUER_BASE_URL'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
