import { Module } from '@nestjs/common';
import { ConceptsService } from './concepts.service';
import { ConceptsController } from './concepts.controller';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [JwtModule],
  providers: [ConceptsService],
  controllers: [ConceptsController],
})
export class ConceptModule {}
