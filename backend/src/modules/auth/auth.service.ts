import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../modules/users/user.entity';

@Injectable()
export class AuthService {
  private readonly recaptchaSecret: string;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    if (!process.env.RECAPTCHA_SECRET_KEY) {
      throw new Error('RECAPTCHA_SECRET_KEY no está definida en .env');
    }
    this.recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  }

  // Validation reCAPTCHA
  private async validateRecaptcha(token: string): Promise<boolean> {
    const params = new URLSearchParams();
    params.append('secret', this.recaptchaSecret);
    params.append('response', token);

    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      },
    );

    const data = await response.json();
    console.log('reCAPTCHA response:', data);

    return data.success === true;
  }

  // SIGNUP
  async signUp(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    captchaToken: string;
  }) {
    const { firstName, lastName, email, password, captchaToken } = data;

    const isCaptchaValid = await this.validateRecaptcha(captchaToken);
    if (!isCaptchaValid) throw new UnauthorizedException('Captcha inválido');

    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) throw new Error('User already exists');

    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashed,
      role: 'student',
    });
    await this.userRepository.save(user);

    return {
      message: 'User created',
      id: user.id,
      firstName,
      lastName,
      email,
      role: user.role,
    };
  }

  // SIGNIN
  async signIn(data: {
    email: string;
    password: string;
    captchaToken: string;
  }) {
    const { email, password, captchaToken } = data;

    const isCaptchaValid = await this.validateRecaptcha(captchaToken);
    if (!isCaptchaValid) throw new UnauthorizedException('Captcha inválido');

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new Error('User not found');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    const access_token = this.jwtService.sign({
      email: user.email,
      sub: user.id,
      role: user.role,
    });

    return {
      access_token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,

        role: user.role,
      },
    };
  }
}
