import { Module } from '@nestjs/common';
import { AircraftService } from './aircraft.service';
import { AircraftController } from './aircraft.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AircraftController],
  providers: [AircraftService, PrismaService, JwtService],
})
export class AircraftModule {}
