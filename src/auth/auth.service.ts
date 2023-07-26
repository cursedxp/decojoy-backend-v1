import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  signup() {
    return { message: 'User has been created' };
  }
  signin() {
    return { message: 'User signed in' };
  }
}
