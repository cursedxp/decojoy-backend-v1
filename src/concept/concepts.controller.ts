import {
  Controller,
  Post,
  Body,
  Request,
  Delete,
  Param,
  Put,
  Patch,
  Query,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ConceptsService } from './concepts.service';
import { CreateConceptDto } from './dto';
import { PaginationDto } from 'src/pagination/dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('concepts')
export class ConceptsController {
  constructor(private readonly conceptsService: ConceptsService) {}

  @Post('create')
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

  @Patch(':conceptId/publish')
  async publishConcept(@Param('conceptId') conceptId: string) {
    return this.conceptsService.publishConcept(conceptId);
  }
  @Get()
  async getPartners(@Query() paginationDto: PaginationDto) {
    return this.conceptsService.getAllConcepts(paginationDto);
  }
}
