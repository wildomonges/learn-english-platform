import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(data): Promise<any> {
    const { firstName, lastName, email, password } = data;

    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) throw new Error('User already exists');

    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashed,
    });
    await this.userRepository.save(user);

    return {
      message: 'User created',
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }

  async signIn({ email, password }): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new Error('User not found');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
