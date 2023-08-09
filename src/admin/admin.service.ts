import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prismaService: PrismaService) {}
  async create(dto) {
    const {
      title,
      thumbnail,
      images,
      description,
      style,
      roomType,
      userId,
      productIds,
    } = dto;

    const concept = await this.prismaService.concept.create({
      data: {
        title: title,
        thumbnail: thumbnail,
        images: images,
        description: description,
        style: style,
        roomType: roomType,
        userId: userId,
        products: {
          connect: productIds.map((id) => ({ id })),
        },
      },
    });

    return concept;
  }
}
