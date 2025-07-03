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
  constructor(private readonly fanService: FanService) {}

  @Post(":fanId/follow/:celebId")
  follow(@Param("fanId") fanId: number, @Param("celebId") celebId: number) {
    return this.fanService.followCelebrity(fanId, celebId);
  }

  @Delete(":fanId/unfollow/:celebId")
  unfollow(@Param("fanId") fanId: number, @Param("celebId") celebId: number) {
    return this.fanService.unfollowCelebrity(fanId, celebId);
  }

  @Get(":fanId/following")
  getFollowing(@Param("fanId") fanId: number) {
    return this.fanService.getFollowedCelebrities(fanId); // ✅ should return array
  }
}
