import { Injectable } from '@nestjs/common';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import responseHelper from 'src/helper/response-helper';

@Injectable()
export class HomeService {
  constructor(private readonly prisma: PrismaService) {}
  // create(createHomeDto: CreateHomeDto) {
  //   return 'This action adds a new home';
  // }

  // findAll() {
  //   return `This action returns all home`;
  // }
  async getInfo(user: any) {
    if (user.role === 'ADMIN') {
      const totalBookings = await this.prisma.booking.count();
      const totalPilots = await this.prisma.pilot.count();
      const totalPackages = await this.prisma.package.count();
      const totalUsers = await this.prisma.user.count();
      const agencys = await this.prisma.user.findMany({
        where: {
          role: 'AGENCY',
        },
        select: {
          id: true,
          name: true,
          email: true,
          contact: true,
          about: true,
        },
      });
      const maxTotal = await this.prisma.booking.aggregate({
        where: {
          nationality: {
            notIn: ['india', 'nepal'],
          },
        },
        _sum: {
          totalPrice: true,
          commissionMax: true,
          prePayment: true,
        },
      });
      const minTotal = await this.prisma.booking.aggregate({
        where: {
          nationality: {
            in: ['india', 'nepal'],
          },
        },
        _sum: {
          totalPrice: true,
          commissionMin: true,
        },
      });
      return responseHelper.success('Info found successfully', {
        totalBookings,
        totalPilots,
        totalPackages,
        totalUsers,
        maxTotal: maxTotal._sum.totalPrice,
        maxCommission: maxTotal._sum.commissionMax,
        minTotal: minTotal._sum.totalPrice,
        minCommission: minTotal._sum.commissionMin,
        prePayment: maxTotal._sum.prePayment,
        agencys,
        user,
      });
    } else {
      const totalBookings = await this.prisma.booking.count({
        where: {
          userId: user.id,
        },
      });
      const maxTotal = await this.prisma.booking.aggregate({
        where: {
          userId: user.id,
          nationality: {
            notIn: ['india', 'nepal'],
          },
        },
        _sum: {
          totalPrice: true,
          commissionMax: true,
        },
      });
      const minTotal = await this.prisma.booking.aggregate({
        where: {
          userId: user.id,
          nationality: {
            in: ['india', 'nepal'],
          },
        },
        _sum: {
          totalPrice: true,
          commissionMin: true,
        },
      });

      return responseHelper.success('Info found successfully', {
        totalBookings,
        minTotal: minTotal._sum.totalPrice,
        minCommission: minTotal._sum.commissionMin,
        maxTotal: maxTotal._sum.totalPrice,
        maxCommission: maxTotal._sum.commissionMax,
        user,
      });
    }
  }
  // findOne(id: number) {
  //   return `This action returns a #${id} home`;
  // }

  // update(id: number, updateHomeDto: UpdateHomeDto) {
  //   return `This action updates a #${id} home`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} home`;
  // }
}
