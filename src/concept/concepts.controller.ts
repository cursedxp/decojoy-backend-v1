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

  @Post()
  async create(
    @Body() createConceptDto: CreateConceptDto,
    @Request() request: Request,
  ) {
    const payload = request['user'];
    return this.conceptsService.createConcept(createConceptDto, payload);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.conceptsService.deleteConcept(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateConceptDto: CreateConceptDto,
  ) {
    return this.conceptsService.updateConcept(id, updateConceptDto);
  }

  @Patch(':id/publish')
  async publishConcept(@Param('id') id: string) {
    return this.conceptsService.publishConcept(id);
  }

  @Patch(':id/unpublish')
  async unPublishConcept(@Param('id') id: string) {
    return this.conceptsService.unPublishConcept(id);
  }
  @Get()
  async getAllConcepts(@Query() paginationDto: PaginationDto) {
    return this.conceptsService.getAllConcepts(paginationDto);
  }
}
