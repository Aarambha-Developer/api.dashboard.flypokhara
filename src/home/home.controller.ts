import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { CurrentUser } from 'src/current-user/current-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  // @Post()
  // create(@Body() createHomeDto: CreateHomeDto) {
  //   return this.homeService.create(createHomeDto);
  // }
  @Get()
  @ApiBearerAuth()
  findAll(@CurrentUser() user: any) {
    return this.homeService.getInfo(user);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.homeService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateHomeDto: UpdateHomeDto) {
  //   return this.homeService.update(+id, updateHomeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.homeService.remove(+id);
  // }
}
