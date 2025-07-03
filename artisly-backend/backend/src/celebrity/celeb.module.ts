import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Celebrity } from './entities/celebrity.entity';
import { CelebrityController } from './celeb.controller';
import { CelebrityService } from './celeb.service';

@Module({
  imports: [TypeOrmModule.forFeature([Celebrity])],
  controllers: [CelebrityController],
  providers: [CelebrityService],
})
export class CelebModule {}


// import { Module } from '@nestjs/common';
// import { CelebrityController } from './celeb.controller';
// import { CelebrityService } from './celeb.service';

// @Module({
//   controllers: [CelebrityController],
//   providers: [CelebrityService],
// })
// export class CelebModule {}
