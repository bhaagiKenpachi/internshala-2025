// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
