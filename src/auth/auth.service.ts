import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { ifError } from 'assert';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}
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
      console.log('User has been created');
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return { message: 'This user already exists in our db' };
        }
      }
    }
  }
  signIn() {
    return { message: 'User signed in' };
  }
}
