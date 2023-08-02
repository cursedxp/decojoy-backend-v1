import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('concepts')
export class AdminController {
  @Post()
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  createConcept() {
    return { message: 'Concept is created' };
  }
}
