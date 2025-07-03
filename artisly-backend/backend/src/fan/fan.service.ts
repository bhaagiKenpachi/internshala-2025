import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Celebrity } from '../celebrity/entities/celebrity.entity';
import { CreateCelebrityDto } from '../celebrity/dto/create-celeb.dto';
import { Fan } from '../celebrity/entities/fan.entity';


@Injectable()
export class FanService {
  constructor(
    @InjectRepository(Fan) private fanRepo: Repository<Fan>,
    @InjectRepository(Celebrity) private celebRepo: Repository<Celebrity>
  ) {}

  async followCelebrity(fanId: number, celebId: number) {
    const fan = await this.fanRepo.findOne({ where: { id: fanId }, relations: ['followedCelebrities'] });
    const celeb = await this.celebRepo.findOneBy({ id: celebId });

    if (!fan || !celeb) throw new NotFoundException('Fan or Celebrity not found');

    fan.followedCelebrities.push(celeb);
    return this.fanRepo.save(fan);
  }

  async unfollowCelebrity(fanId: number, celebId: number) {
    const fan = await this.fanRepo.findOne({ where: { id: fanId }, relations: ['followedCelebrities'] });
    if (!fan) throw new NotFoundException('Fan not found');

    fan.followedCelebrities = fan.followedCelebrities.filter(c => c.id !== celebId);
    return this.fanRepo.save(fan);
  }

 async getFollowedCelebrities(fanId: number) {
  const fan = await this.fanRepo.findOne({
    where: { id: fanId },
    relations: ['followedCelebrities'],
  });

  return fan?.followedCelebrities ?? []; // ✅ always return an array
}
}
