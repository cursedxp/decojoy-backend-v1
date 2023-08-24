import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateConceptDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConceptsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createConcept(data: CreateConceptDto, payload) {
    try {
      return this.prismaService.concept.create({
        data: {
          ...data,
          createdBy: { connect: { id: payload.sub } },
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async deleteConcept(conceptId: string) {
    try {
      const concept = await this.prismaService.concept.findUnique({
        where: { id: conceptId },
      });

      if (!concept) {
        throw new NotFoundException(`Concept with ID ${conceptId} not found`);
      }
      const deletedConcept = this.prismaService.concept.delete({
        where: { id: conceptId },
      });
      return {
        message: 'Concept has been deleted',
        deletedConcept: deletedConcept,
      };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateConcept(conceptId: string, updateData: CreateConceptDto) {
    try {
      const concept = await this.prismaService.concept.findUnique({
        where: { id: conceptId },
      });

      if (!concept) {
        throw new NotFoundException(`Concept with ID ${conceptId} not found`);
      }

      return this.prismaService.concept.update({
        where: { id: conceptId },
        data: updateData,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getAllProducts() {
    return this.prismaService.concept.findMany();
  }

  private handlePrismaError(error: any) {
    switch (error.code) {
      case 'P2002':
        throw new ConflictException('Unique constraint violation.');
      case 'P2016':
        throw new NotFoundException('Record not found.');
      case 'P2003':
        throw new BadRequestException('Foreign key constraint failed.');
      case 'P2001':
      default:
        throw new InternalServerErrorException(
          'An internal server error occurred.',
        );
    }
  }
}
