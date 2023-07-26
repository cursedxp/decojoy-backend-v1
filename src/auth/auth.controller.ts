import { Controller, Post } from '@nestjs/common';
import { AuthService } from './authService';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  //Signup
  @Post('signup')
  signup() {
    return this.authService.signup();
  }
  @Post('signin')
  signin() {
    return this.authService.signin();
  }
}
