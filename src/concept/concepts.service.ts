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
  constructor(private readonly prisma: PrismaService) {}

  async createConcept(data: CreateConceptDto, payload) {
    try {
      return this.prisma.concept.create({
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
      const concept = await this.prisma.concept.findUnique({
        where: { id: conceptId },
      });

      if (!concept) {
        throw new NotFoundException(`Concept with ID ${conceptId} not found`);
      }

      return this.prisma.concept.delete({ where: { id: conceptId } });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateConcept(conceptId: string, updateData: CreateConceptDto) {
    try {
      const concept = await this.prisma.concept.findUnique({
        where: { id: conceptId },
      });

      if (!concept) {
        throw new NotFoundException(`Concept with ID ${conceptId} not found`);
      }

      return this.prisma.concept.update({
        where: { id: conceptId },
        data: updateData,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
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
