import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt/jwt.strategy';

@Module({
  providers: [JwtStrategy],
})
export class AuthModule {}
