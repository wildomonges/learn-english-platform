import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign_up')
  signUp(@Body() dto: SignupDto) {
    return this.authService.signUp(dto);
  }

  @Post('sign_in')
  signIn(@Body() dto: SigninDto) {
    return this.authService.signIn(dto);
  }
}
