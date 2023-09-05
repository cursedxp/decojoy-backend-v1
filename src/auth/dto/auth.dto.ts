import { IsString, IsEmail, IsOptional } from 'class-validator';
export class CreateUserDto {
  @IsString()
  auth0Id: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsEmail()
  email: string;

  // ... other fields ...
}
