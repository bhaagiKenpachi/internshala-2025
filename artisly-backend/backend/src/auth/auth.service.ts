// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async createUser(email: string, password: string, role: string) {
    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const user = this.userRepo.create({
      email,
      password,
      role: role as 'fan' | 'celebrity'
    });

    return this.userRepo.save(user);
  }
}
