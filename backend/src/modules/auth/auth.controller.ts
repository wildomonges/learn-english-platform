import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign_up')
  async signUp(@Body() dto: SignupDto) {
    if (!dto.captchaToken)
      throw new BadRequestException('reCAPTCHA token requerido');
    return this.authService.signUp(dto);
  }

  @Post('sign_in')
  async signIn(@Body() dto: SigninDto) {
    if (!dto.captchaToken)
      throw new BadRequestException('reCAPTCHA token requerido');
    return this.authService.signIn(dto);
  }
}
