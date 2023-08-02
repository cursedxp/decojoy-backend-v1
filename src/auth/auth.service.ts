import {
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { ifError } from 'assert';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  async signUp(dto) {
    try {
      const hashedPassword = await argon2.hash(dto.password);
      const user = await this.prismaService.user.create({
        data: {
          fullName: dto.fullName,
          email: dto.email,
          password: hashedPassword,
        },
      });
      console.log('👤 User has been created');
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Email address must be unique and not used on other accounts',
          );
        }
        throw new ForbiddenException();
      }
    }
  }
  async signIn(dto): Promise<object> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user) {
        throw new UnauthorizedException('This email address is not registered');
      }
      const password = await argon2.verify(user.password, dto.password);
      if (!password) {
        throw new UnauthorizedException(
          'Passwords do not match. Please try again',
        );
      }
      console.log(typeof this.createToken(user.id, user.email, user.role));
      return this.createToken(user.id, user.email, user.role);
    } catch (error) {
      //console.log(error.message);
      throw error;
    }
  }
  async createToken(
    userId: string,
    email: string,
    role: Role,
  ): Promise<object> {
    const payload = {
      sub: userId,
      email: email,
      role: role,
    };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }
}
