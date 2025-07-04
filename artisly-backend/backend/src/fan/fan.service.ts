import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class FanService {
  async followCelebrity(userId: string, celebId: string) {
    // Check if user and celebrity exist
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const celebrity = await prisma.celebrity.findUnique({ where: { id: celebId } });

    if (!user || !celebrity) {
      throw new NotFoundException('User or Celebrity not found');
    }

    // Check if user is a fan
    if (user.role !== 'fan') {
      throw new NotFoundException('Only fans can follow celebrities');
    }

    // For now, we'll use a simple approach with localStorage-like tracking
    // In a real app, you'd have a proper follow table
    return { success: true, message: 'Followed successfully' };
  }

  async unfollowCelebrity(userId: string, celebId: string) {
    // Check if user and celebrity exist
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const celebrity = await prisma.celebrity.findUnique({ where: { id: celebId } });

    if (!user || !celebrity) {
      throw new NotFoundException('User or Celebrity not found');
    }

    // Check if user is a fan
    if (user.role !== 'fan') {
      throw new NotFoundException('Only fans can unfollow celebrities');
    }

    return { success: true, message: 'Unfollowed successfully' };
  }

  async getFollowedCelebrities(userId: string) {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is a fan
    if (user.role !== 'fan') {
      throw new NotFoundException('Only fans can have followed celebrities');
    }

    // For now, return empty array - in a real app, you'd query the follow table
    return [];
  }
}
