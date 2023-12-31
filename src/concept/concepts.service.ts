import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateConceptDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/pagination/dto';

@Injectable()
export class ConceptsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createConcept(data: CreateConceptDto, payload) {
    try {
      // Find user by their auth0Id
      const user = await this.prismaService.user.findUnique({
        where: { auth0Id: payload.sub },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Now create the concept using the user's id
      const newConcept = await this.prismaService.concept.create({
        data: {
          ...data,
          createdByAuth0Id: payload.sub,
        },
      });
      return {
        message: 'Concept has been created',
        newConcept: newConcept.title,
      };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async deleteConcept(id: string) {
    try {
      const concept = await this.prismaService.concept.findUnique({
        where: { id: id },
      });

      if (!concept) {
        throw new NotFoundException(`Concept with ID ${id} not found`);
      }
      const deletedConcept = await this.prismaService.concept.delete({
        where: { id: id },
      });
      return {
        success: true,
        message: 'Concept has been deleted',
        data: deletedConcept,
      };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateConcept(id: string, updateData: CreateConceptDto) {
    try {
      const concept = await this.prismaService.concept.findUnique({
        where: { id: id },
      });

      if (!concept) {
        throw new NotFoundException(`Concept with ID ${id} not found`);
      }

      return this.prismaService.concept.update({
        where: { id: id },
        data: updateData,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getConceptById(id: string) {
    console.log('id', id);
    try {
      const concept = await this.prismaService.concept.findUnique({
        where: { id: id },
      });

      if (!concept) {
        throw new NotFoundException(`Concept with ID ${id} not found`);
      }

      return concept;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async toggleConceptStatus(id: string) {
    try {
      const concept = await this.prismaService.concept.findUnique({
        where: { id: id },
      });

      if (!concept) {
        throw new NotFoundException(`Concept with ID ${id} not found`);
      }

      const status = concept.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';

      return this.prismaService.concept.update({
        where: { id: id },
        data: { status: status },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getAllConcepts(paginationDto: PaginationDto) {
    const skip = (paginationDto.page - 1) * paginationDto.limit;
    return this.prismaService.concept.findMany({
      take: paginationDto.limit,
      skip: skip,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAllPublishedConcepts(paginationDto: PaginationDto) {
    const skip = (paginationDto.page - 1) * paginationDto.limit;
    return this.prismaService.concept.findMany({
      where: {
        status: 'PUBLISHED',
      },
      take: paginationDto.limit,
      skip: skip,
      orderBy: {
        createdAt: 'desc',
      },
    });
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
