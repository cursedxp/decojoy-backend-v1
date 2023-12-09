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

  @Patch(':id/status')
  async updateConceptStatus(@Param('id') id: string) {
    return this.conceptsService.togleConceptStatus(id);
  }
  @Get()
  async getAllConcepts(@Query() paginationDto: PaginationDto) {
    return this.conceptsService.getAllConcepts(paginationDto);
  }
  @Get(':id')
  async getConceptById(@Param('id') id: string) {
    console.log('id', id);
    return this.conceptsService.getConceptById(id);
  }
}
