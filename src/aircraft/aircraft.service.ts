import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAircraftDto } from './dto/create-aircraft.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import responseHelper from 'src/helper/response-helper';

@Injectable()
export class AircraftService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAircraftDto: CreateAircraftDto) {
    const aircraft = await this.prisma.aircraft.create({
      data: createAircraftDto,
    });
    return responseHelper.success('aircraft create successfully', aircraft);
  }

  async findAll() {
    const aircrafts = await this.prisma.aircraft.findMany();
    return responseHelper.success('Available Aircraft', aircrafts);
  }

  async findOne(id: number) {
    const aircraft = await this.prisma.aircraft.findUnique({
      where: {
        id: id,
      },
    });
    if (!aircraft) {
      throw new NotFoundException(responseHelper.error('Not found'));
    }
    return responseHelper.success('aircraft found successfully', aircraft);
  }

  // update(id: number, updateAircraftDto: UpdateAircraftDto) {
  //   return `This action updates a #${id} aircraft`;
  // }

  async remove(id: number) {
    const existAircraft = await this.prisma.aircraft.findUnique({
      where: {
        id: id,
      },
    });
    if (!existAircraft) {
      throw new NotFoundException(responseHelper.error('Not found'));
    }
    await this.prisma.aircraft.delete({
      where: {
        id: id,
      },
    });
    return responseHelper.success(
      'aircraft deleted successfully',
      existAircraft,
    );
  }
}
