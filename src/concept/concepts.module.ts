import { Module } from '@nestjs/common';
import { ConceptsService } from './concepts.service';
import { ConceptsController } from './concepts.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [JwtModule, AuthModule],
  providers: [ConceptsService],
  controllers: [ConceptsController],
})
export class ConceptModule {}
