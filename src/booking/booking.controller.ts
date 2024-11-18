import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto, PaginationQueryDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/current-user/current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
@UseGuards(AuthGuard)
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiBearerAuth()
  create(@Body() createBookingDto: CreateBookingDto, @CurrentUser() user: any) {
    return this.bookingService.create(user, createBookingDto);
  }

  @Get()
  @ApiBearerAuth()
  findAll(@CurrentUser() user: any, @Param() params: any,@Query() query: PaginationQueryDto) {
    return this.bookingService.findAll(user, query);
  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingService.findOne(+id, user);
  }

  @Patch(':id')
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingService.update(+id, updateBookingDto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingService.remove(+id, user);
  }
}
