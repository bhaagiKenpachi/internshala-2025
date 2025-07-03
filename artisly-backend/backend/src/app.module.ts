import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CelebModule } from './celebrity/celeb.module';
import {CelebrityController} from './celebrity/celeb.controller'
import {CelebrityService} from './celebrity/celeb.service'
import { Fan } from './celebrity/entities/fan.entity'
import { FanService } from './fan/fan.service';
import { FanController } from './fan/fan.controller';
import { AuthModule } from './auth/auth.module';


// import { AiController } from './ai/ai.controller';
import { Celebrity } from './celebrity/entities/celebrity.entity';

import { ConfigModule } from '@nestjs/config';

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
      entities: [Celebrity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Celebrity]),
  ],
  controllers: [CelebrityController],
  providers: [CelebrityService],
 
})


@Module({
  imports: [
    TypeOrmModule.forRoot({ /* existing config */ entities: [Celebrity, Fan], /* ... */ }),
    TypeOrmModule.forFeature([Celebrity, Fan])
  ],
  controllers: [CelebrityController, FanController],
  providers: [CelebrityService, FanService],
})

@Module({
  imports: [
    AuthModule
  ]
})


export class AppModule {}


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
