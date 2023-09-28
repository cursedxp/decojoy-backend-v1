import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByAuth0Id(auth0Id: string) {
    return await this.prisma.user.findUnique({
      where: { auth0Id: auth0Id },
    });
  }

  async createWithAuth0(payload: any) {
    // Extracting the necessary fields
    const auth0Id = payload.sub;
    const email = payload.email; // Assuming the payload contains the email

    // Check if user with the given Auth0 ID already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { auth0Id: auth0Id },
    });

    if (existingUser) {
      // User already exists in the system, return the existing user data or some relevant message
      return existingUser;
    } else {
      // This is a first-time login, create the new user
      return await this.prisma.user.create({
        data: {
          auth0Id: auth0Id,
          email: email,
        },
      });
    }
  }

  async synchronizeProfile(payload: any, existingUser: any) {
    // Compare data from Auth0 payload with existingUser data.
    // For simplicity, we'll just check email and fullName.
    if (payload.email !== existingUser.email) {
      // If there are differences, update the user record in your database.
      return await this.prisma.user.update({
        where: { auth0Id: payload.sub },
        data: {
          email: payload.email,
        },
      });
    }
    return existingUser; // if no changes, just return the existing user data.
  }
}
