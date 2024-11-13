import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import responseHelper from 'src/helper/response-helper';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}
  async create(user: any, createBookingDto: CreateBookingDto) {
    try {
      let totalPrice = 0;
      let commission = 0;
      const pack = await this.prisma.package.findUnique({
        where: {
          id: createBookingDto.packageId,
        },
      });
      console.log(pack, 'packages for booking');
      if (!pack) {
        throw new NotFoundException(
          responseHelper.error('Package not found', pack),
        );
      }
      if (createBookingDto.flightType === 'COMMERICAL') {
        if (
          createBookingDto.nationality.toLocaleLowerCase() !== 'indian' &&
          createBookingDto.nationality.toLocaleLowerCase() !== 'nepali'
        ) {
          totalPrice = pack.maxPrice;
          commission = (createBookingDto.commission * totalPrice) / 100;
          if (createBookingDto.includes) {
            totalPrice += pack.includeMaxPrice;
          }
        } else {
          totalPrice = pack.minPrice;
          commission = (createBookingDto.commission * totalPrice) / 100;
          if (createBookingDto.includes) {
            totalPrice += pack.includeMinPrice;
          }
        }
      }
      const booking = await this.prisma.booking.create({
        data: {
          userId: user.id,
          pilotId: createBookingDto.pilotId,
          flightDate: createBookingDto.flightDate,
          packageId: createBookingDto.packageId,
          nationality: createBookingDto.nationality.toLocaleLowerCase(),
          totalPrice: totalPrice,
          discount: createBookingDto.discount,
          prePayment: createBookingDto.prePayment,
          flightType: createBookingDto.flightType,
          paymentMethod: createBookingDto.paymentMethod,
          includes: createBookingDto.includes,
          pName: createBookingDto.pName,
          pId: createBookingDto.pId,
          identificationType: createBookingDto.identificationType,
          ticketNo: createBookingDto.ticketNo,
        },
      });
      return responseHelper.success('Booking created successfully', booking);
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error(error.message || 'Internal Server Error'),
      );
    }
  }

  async findAll(user: { id: number; role: string }, params: any) {
    if (user.role !== 'ADMIN') {
      const bookings = await this.prisma.booking.findMany({
        where: {
          userId: user.id,
        },
        select: {
          id: true,
          userId: true,
          pilotId: true,
          flightDate: true,
          packageId: true,
          nationality: true,
          totalPrice: true,
          discount: true,
          prePayment: true,
          flightType: true,
          paymentMethod: true,
          includes: true,
          commission: true,
        },
      });
      if (!bookings) {
        throw new NotFoundException(responseHelper.error('Not found'));
      }
      return responseHelper.success('Bookings found successfully', bookings);
    }
    const bookings = await this.prisma.booking.findMany({
      select: {
        id: true,
        userId: true,
        pilotId: true,
        flightDate: true,
        packageId: true,
        nationality: true,
        totalPrice: true,
        discount: true,
        prePayment: true,
        flightType: true,
        paymentMethod: true,
        includes: true,
        commission: true,
      },
    });
    if (!bookings) {
      throw new NotFoundException(responseHelper.error('Not found'));
    }
    return responseHelper.success('Bookings found successfully', bookings);
  }

  async findOne(id: number, user: any) {
    if (user.role !== 'ADMIN') {
      const booking = await this.prisma.booking.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
        include: {
          pilot: true,
          package: true,
          user: true,
        },
      });
      if (!booking) {
        throw new NotFoundException(responseHelper.error('Not found'));
      }
      return responseHelper.success('Booking found successfully', booking);
    }

    const booking = await this.prisma.booking.findUnique({
      where: {
        id: id,
      },
    });
    if (!booking) {
      throw new NotFoundException(responseHelper.error('Not found'));
    }
    return responseHelper.success('Booking found successfully', booking);
  }

  async update(id: number, updateBookingDto: UpdateBookingDto, user: any) {
    try {
      let totalPrice = 0;
      let commission = 0;
      if (user.role !== 'ADMIN') {
        const booking = await this.prisma.booking.findUnique({
          where: {
            id: id,
            userId: user.id,
          },
        });
        if (!booking) {
          throw new NotFoundException(responseHelper.error('Not found'));
        }
        const pack = await this.prisma.package.findUnique({
          where: {
            id: updateBookingDto.packageId,
          },
        });
        if (!pack) {
          throw new NotFoundException(
            responseHelper.error('Package not found', pack),
          );
        }
        if (updateBookingDto.flightType === 'COMMERICAL') {
          if (
            updateBookingDto.nationality.toLocaleLowerCase() !== 'indian' &&
            updateBookingDto.nationality.toLocaleLowerCase() !== 'nepali'
          ) {
            totalPrice = pack.maxPrice;
            commission = (updateBookingDto.commission * totalPrice) / 100;
            if (updateBookingDto.includes) {
              totalPrice += pack.includeMaxPrice;
            }
          } else {
            totalPrice = pack.minPrice;
            commission = (updateBookingDto.commission * totalPrice) / 100;
            if (updateBookingDto.includes) {
              totalPrice += pack.includeMinPrice;
            }
          }
        }
        const updatedBooking = await this.prisma.booking.update({
          where: {
            id: id,
            userId: user.id,
          },
          data: {
            flightDate: updateBookingDto.flightDate,
            packageId: updateBookingDto.packageId,
            nationality: updateBookingDto.nationality,
            totalPrice,
            discount: updateBookingDto.discount,
            prePayment: updateBookingDto.prePayment,
            flightType: updateBookingDto.flightType,
            paymentMethod: updateBookingDto.paymentMethod,
            includes: updateBookingDto.includes,
            pName: updateBookingDto.pName,
            pId: updateBookingDto.pId,
            identificationType: updateBookingDto.identificationType,
            ticketNo: updateBookingDto.ticketNo,
          },
        });
        return responseHelper.success(
          'Booking updated successfully',
          updatedBooking,
        );
      } else {
        const booking = await this.prisma.booking.findUnique({
          where: {
            id: id,
          },
        });
        if (!booking) {
          throw new NotFoundException(responseHelper.error('Not found'));
        }
        const pack = await this.prisma.package.findUnique({
          where: {
            id: updateBookingDto.packageId,
          },
        });
        if (!pack) {
          throw new NotFoundException(
            responseHelper.error('Package not found', pack),
          );
        }
        if (updateBookingDto.flightType === 'COMMERICAL') {
          if (
            updateBookingDto.nationality.toLocaleLowerCase() !== 'indian' &&
            updateBookingDto.nationality.toLocaleLowerCase() !== 'nepali'
          ) {
            totalPrice = pack.maxPrice;
            commission = (updateBookingDto.commission * totalPrice) / 100;
            if (updateBookingDto.includes) {
              totalPrice += pack.includeMaxPrice;
            }
          }
        }
        const updatedBooking = await this.prisma.booking.update({
          where: {
            id: id,
          },
          data: {
            flightDate: updateBookingDto.flightDate,
            packageId: updateBookingDto.packageId,
            nationality: updateBookingDto.nationality,
            totalPrice,
            discount: updateBookingDto.discount,
            prePayment: updateBookingDto.prePayment,
            flightType: updateBookingDto.flightType,
            paymentMethod: updateBookingDto.paymentMethod,
            includes: updateBookingDto.includes,
            commission,
            pName: updateBookingDto.pName,
            pId: updateBookingDto.pId,
            identificationType: updateBookingDto.identificationType,
            ticketNo: updateBookingDto.ticketNo,
          },
        });
        return responseHelper.success(
          'Booking updated successfully',
          updatedBooking,
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error(error.message || 'Internal Server Error'),
      );
    }
  }

  async remove(id: number, user: any) {
    if (user.role !== 'ADMIN') {
      const booking = this.prisma.booking.findUnique({
        where: {
          id,
          userId: user.id,
        },
      });
      if (!booking) {
        throw new NotFoundException(responseHelper.error('Not found'));
      }
      const deletedBooking = await this.prisma.booking.delete({
        where: {
          id,
        },
      });
      return responseHelper.success(
        'Booking deleted successfully',
        deletedBooking,
      );
    }
    const booking = this.prisma.booking.findUnique({
      where: {
        id,
      },
    });
    if (!booking) {
      throw new NotFoundException(responseHelper.error('Not found'));
    }
    const deletedBooking = await this.prisma.booking.delete({
      where: {
        id,
      },
    });
    return responseHelper.success(
      'Booking deleted successfully',
      deletedBooking,
    );
  }
}