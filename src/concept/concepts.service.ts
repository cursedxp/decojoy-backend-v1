import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConceptDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConceptsService {
  constructor(private readonly prisma: PrismaService) {}

  async createConcept(data: CreateConceptDto, payload) {
    return this.prisma.concept.create({
      data: {
        ...data,
        createdBy: { connect: { id: payload.sub } },
      },
    });
  }
  async deleteConcept(conceptId: string) {
    const concept = await this.prisma.concept.findUnique({
      where: { id: conceptId },
    });

    if (!concept) {
      throw new NotFoundException(`Concept with ID ${conceptId} not found`);
    }

    return this.prisma.concept.delete({ where: { id: conceptId } });
  }
  async updateConcept(conceptId: string, updateData: CreateConceptDto) {
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
  }
}
