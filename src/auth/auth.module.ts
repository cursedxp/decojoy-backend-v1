import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy],
})
export class AuthModule {}
