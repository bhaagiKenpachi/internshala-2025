// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fan } from '../celebrity/entities/fan.entity';
import { Celebrity } from '../celebrity/entities/celebrity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fan, Celebrity]),
    JwtModule.register({ secret: 'your_jwt_secret' }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
