import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  //Signup
  @Post('signup')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }
  @Post('signin')
  signIn() {
    return this.authService.signIn();
  }
}
