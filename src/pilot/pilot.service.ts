import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePilotDto } from './dto/create-pilot.dto';
import { UpdatePilotDto } from './dto/update-pilot.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import responseHelper from 'src/helper/response-helper';

@Injectable()
export class PilotService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPilotDto: CreatePilotDto) {
    const pilot = await this.prisma.pilot.create({
      data: createPilotDto,
    });
    return responseHelper.success('pilot create successfully', pilot);
  }

  async findAll() {
    const pilot = await this.prisma.pilot.findMany();
    if (!pilot) {
      throw new NotFoundException(responseHelper.error('NOT FOUND'));
    }
    return responseHelper.success('Available Pilot', pilot);
  }

  async findOne(id: number) {
    const pilot = await this.prisma.pilot.findUnique({
      where: {
        id,
      },
    });
    if (!pilot) {
      throw new NotFoundException(responseHelper.error('pilot not found'));
    }
    return responseHelper.success('Pilot found', pilot);
  }

  update(id: number, updatePilotDto: UpdatePilotDto) {
    return `This action updates a #${id} pilot`;
  }

  async remove(id: number) {
    const pilot = await this.prisma.pilot.findUnique({
      where: {
        id,
      },
    });
    if (!pilot) {
      throw new NotFoundException(responseHelper.error('pilot not found'));
    }
    await this.prisma.pilot.delete({
      where: {
        id,
      },
    });
    return responseHelper.success('Pilot delete successfully', pilot);
  }
}
