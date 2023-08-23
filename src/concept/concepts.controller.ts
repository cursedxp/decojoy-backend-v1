import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { ConceptsService } from './concepts.service';
import { CreateConceptDto } from './dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('concepts')
export class ConceptsController {
  constructor(private readonly conceptsService: ConceptsService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  async create(
    @Body() createConceptDto: CreateConceptDto,
    @Request() request: Request,
  ) {
    const payload = request['user'];
    return this.conceptsService.createConcept(createConceptDto, payload);
  }
  @Delete(':conceptId')
  async delete(@Param('conceptId') conceptId: string) {
    return this.conceptsService.deleteConcept(conceptId);
  }
  @Put(':conceptId')
  async update(
    @Param('conceptId') conceptId: string,
    @Body() updateConceptDto: CreateConceptDto,
  ) {
    return this.conceptsService.updateConcept(conceptId, updateConceptDto);
  }
}
