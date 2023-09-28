import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy, UserService],
})
export class AuthModule {}
