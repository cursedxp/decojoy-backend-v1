import { Injectable } from '@nestjs/common';
import * as jwksRsa from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
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
    // Check if user exists in your database based on the Auth0 user ID (sub)
    let user = await this.userService.findByAuth0Id(payload.sub);

    if (!user) {
      // If not, create them
      user = await this.userService.createWithAuth0(payload);
    } else {
      // If user exists, synchronize profile data
      user = await this.userService.synchronizeProfile(payload, user);
    }

    return payload;
  }
}
