import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Celebrity } from './entities/celebrity.entity';
import { CreateCelebrityDto } from './dto/create-celeb.dto';

@Injectable()
export class CelebrityService {
  constructor(
    @InjectRepository(Celebrity)
    private readonly celebRepo: Repository<Celebrity>,
  ) {}

  async create(dto: CreateCelebrityDto) {
    const celeb = this.celebRepo.create(dto);
    return this.celebRepo.save(celeb);
  }

  async findOne(id: number): Promise<any> {
    const celeb = await this.celebRepo.findOneBy({ id });
    if (!celeb) throw new NotFoundException('Celebrity not found');
  
    return {
      ...celeb,
      profileViews: Math.floor(Math.random() * 20000),
      highlights: [
        '🎤 Live at Global Awards 2025',
        '📀 New album hit 1M streams',
        '🎬 Featured in Netflix documentary',
      ],
      engagements: {
        likes: Math.floor(Math.random() * 5000),
        comments: Math.floor(Math.random() * 1000),
        shares: Math.floor(Math.random() * 2000),
      },
    };
  }
  
  
  

  findAll() {
    return this.celebRepo.find();
  }
  
}




// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class CelebService {
//   findAll() {
//     return [
//       {
//         name: 'Coldplay',
//         category: 'Band',
//         country: 'UK',
//         instagramUrl: 'https://instagram.com/coldplay',
//         fanbaseCount: 20000000,
//       },
//       {
//         name: 'Shakira',
//         category: 'Solo',
//         country: 'Colombia',
//         instagramUrl: 'https://instagram.com/shakira',
//         fanbaseCount: 18000000,
//       },
//     ];
//   }
// }