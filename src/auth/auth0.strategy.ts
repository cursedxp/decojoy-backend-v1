import { Strategy, ExtractJwt } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const domain = configService.get('AUTH0_DOMAIN');
    const audience = configService.get('AUTH0_API_AUDIENCE');
    const issuer = `https://${domain}/`;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        jwksUri: `https://${domain}/.well-known/jwks.json`,
      }),
      audience: audience,
      issuer: issuer,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    const role = payload['https://www.decojoy.co/role'];

    if (!role) {
      throw new UnauthorizedException('Token does not contain role claim.');
    }

    return {
      userId: payload.sub,
      role: role,
    };
  }
}
