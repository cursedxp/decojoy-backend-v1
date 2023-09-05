import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './auth0.strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('callback')
  @UseGuards(JwtStrategy)
  async callback(@Request() req): Promise<void> {
    const { user } = req;
    // The exact structure depends on your Auth0 settings

    const auth0Id = user.sub;
    const email = user.email;
    const fullName = user.name;

    // Continue with your callback logic, e.g., redirecting the user

    await this.authService.findOrCreateUser({ auth0Id, email, fullName });
  }
}
