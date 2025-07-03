import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { CelebrityService } from './celeb.service';
import { CreateCelebrityDto } from './dto/create-celeb.dto';

@Controller('celeb')
export class CelebrityController {
  constructor(private readonly celebService: CelebrityService) {}

  @Post()
  create(@Body() dto: CreateCelebrityDto) {
    return this.celebService.create(dto); // Returns created object with id
  }
  
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.celebService.findOne(id); // this returns enriched data
  }
  
  @Get()
  findAll() {
    return this.celebService.findAll();
  }

  
}


// import { Controller, Get } from '@nestjs/common';
// import { CelebService } from './celeb.service';

// @Controller('celeb')
// export class CelebController {
//   constructor(private readonly celebService: CelebService) {}

//   @Get()
//   findAll() {
//     return this.celebService.findAll();
//   }
// }
