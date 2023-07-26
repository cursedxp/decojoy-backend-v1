import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaClient) {}
  signup() {
    return { message: 'User has been created' };
  }
  signin() {
    return { message: 'User signed in' };
  }
}
