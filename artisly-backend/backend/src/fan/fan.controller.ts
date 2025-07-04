import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Delete,
} from "@nestjs/common";
import { FanService } from "./fan.service";

@Controller("fan")
export class FanController {
  constructor(private readonly fanService: FanService) { }

  @Post(":userId/follow/:celebId")
  async followCelebrity(@Param("userId") userId: string, @Param("celebId") celebId: string) {
    return this.fanService.followCelebrity(userId, celebId);
  }

  @Post(":userId/unfollow/:celebId")
  async unfollowCelebrity(@Param("userId") userId: string, @Param("celebId") celebId: string) {
    return this.fanService.unfollowCelebrity(userId, celebId);
  }

  @Get(":userId/followed")
  async getFollowedCelebrities(@Param("userId") userId: string) {
    return this.fanService.getFollowedCelebrities(userId);
  }
}
