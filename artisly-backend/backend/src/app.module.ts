import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CelebModule } from './celebrity/celeb.module';
import { Fan } from './celebrity/entities/fan.entity';
import { FanModule } from './fan/fan.module';
import { AuthModule } from './auth/auth.module';
import { Celebrity } from './celebrity/entities/celebrity.entity';
import { User } from './user/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Celebrity, Fan, User],
      synchronize: true,
    }),
    CelebModule,
    FanModule,
    AuthModule,
  ],
})
export class AppModule { }


// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: process.env.DB_HOST,
//       port: +process.env.DB_PORT,
//       username: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//       entities: [Celebrity],
//       synchronize: true,
//     }),
//     CelebModule,
//   ],
//   // controllers: [AiController],
// })
// export class AppModule {}



// import { Module } from '@nestjs/common';
// import { CelebModule } from './celeb/celeb.module';

// @Module({
//   imports: [CelebModule],
// })
// export class AppModule {}
