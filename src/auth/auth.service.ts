import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async findOrCreateUser(data: CreateUserDto) {
    try {
      let user = await this.prismaService.user.findUnique({
        where: { auth0Id: data.auth0Id },
      });

      if (!user) {
        user = await this.prismaService.user.create({
          data: {
            auth0Id: data.auth0Id,
            email: data.email,
            fullName: data.fullName,
          },
        });
      }

      return user;
    } catch (error) {
      console.error('Error in findOrCreateUser:', error);
      throw error;
    }
  }
}
