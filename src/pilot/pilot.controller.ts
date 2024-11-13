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
import { PilotService } from './pilot.service';
import { CreatePilotDto } from './dto/create-pilot.dto';
import { UpdatePilotDto } from './dto/update-pilot.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('pilot')
export class PilotController {
  constructor(private readonly pilotService: PilotService) {}
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Post()
  create(@Body() createPilotDto: CreatePilotDto) {
    return this.pilotService.create(createPilotDto);
  }

  @Get()
  findAll() {
    return this.pilotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pilotService.findOne(+id);
  }
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePilotDto: UpdatePilotDto) {
    return this.pilotService.update(+id, updatePilotDto);
  }
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pilotService.remove(+id);
  }
}
