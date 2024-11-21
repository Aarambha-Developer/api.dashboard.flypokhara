import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateBookingDto,
  PaginationQueryDto,
  UpdateInAirportDto,
  updateStatusDto,
} from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import responseHelper from 'src/helper/response-helper';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}
  async create(user: any, createBookingDto: CreateBookingDto) {
    try {
      let totalPrice = 0;
      let commissionMin = 0;
      let commissionMax = 0;
      let flightType = createBookingDto.flightType
        ? createBookingDto.flightType
        : 'COMMERCIAL';
      if (!createBookingDto.flightType) {
        createBookingDto.flightType = 'COMMERCIAL';
      }
      const pack = await this.prisma.package.findUnique({
        where: {
          id: createBookingDto.packageId,
        },
      });
      if (!pack) {
        throw new NotFoundException(
          responseHelper.error('Package not found', pack),
        );
      }
      if (flightType == 'COMMERCIAL') {
        if (
          createBookingDto.nationality.toLocaleLowerCase() !== 'india' &&
          createBookingDto.nationality.toLocaleLowerCase() !== 'nepal'
        ) {
          totalPrice = pack.maxPrice;
          // if (pack.duration == '15' || pack.duration == '30') {
          //   commissionMax = (15 * totalPrice) / 100;
          // } else {
          //   commissionMax = (20 * totalPrice) / 100;
          // }
          if (createBookingDto.includes) {
            totalPrice += pack.includeMaxPrice;
          }
        } else {
          totalPrice = pack.minPrice;
          // if (pack.duration == '15' || pack.duration == '30') {
          //   commissionMin = (10 * totalPrice) / 100;
          // } else {
          //   commissionMin = (15 * totalPrice) / 100;
          // }

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
          discount: user.role !== 'ADMIN' ? 0 : createBookingDto.discount,
          prePayment: user.role !== 'ADMIN' ? 0 : createBookingDto.prePayment,
          flightType: createBookingDto.flightType,
          paymentMethod: createBookingDto.paymentMethod,
          includes: createBookingDto.includes,
          pName: createBookingDto.pName,
          pId: createBookingDto.pId,
          identificationType: createBookingDto.pIdType,
          ticketNo: createBookingDto.ticketNo,
          aircraftType: createBookingDto.aircraftType,
          commissionMin: user?.role == 'ADMIN' ? 0 : commissionMin,
          commissionMax: user?.role == 'ADMIN' ? 0 : commissionMax,
        },
      });
      return responseHelper.success('Booking created successfully', booking);
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error(error.message || 'Internal Server Error'),
      );
    }
  }

  async findAll(user: { id: number; role: string }, query: PaginationQueryDto) {
    enum SortOrder {
      asc = 'asc',
      desc = 'desc',
    }
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 10);
    const skip = (page - 1) * limit;
    const orderBy = query.sortBy
      ? {
          [query.sortBy]:
            query.sortOrder === 'asc' ? SortOrder.asc : SortOrder.desc,
        }
      : {
          createdAt: SortOrder.desc,
        };
    if (user.role == 'AGENCY') {
      const total = await this.prisma.booking.count({
        where: {
          userId: user.id,
        },
      });
      const bookings = await this.prisma.booking.findMany({
        skip,
        take: limit,
        orderBy,
        where: {
          userId: user.id,
          pName: {
            contains: query.search,
          },
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
          commissionMax: true,
          commissionMin: true,
          status: true,
          pilot: {
            select: {
              name: true,
              id: true,
            },
          },
          user: {
            select: {
              name: true,
            },
          },
          package: {
            select: {
              title: true,
              duration: true,
            },
          },
          pName: true,
          pId: true,
        },
      });
      const lastPage = Math.ceil(total / limit);
      if (!bookings) {
        throw new NotFoundException(responseHelper.error('Not found'));
      }
      return responseHelper.success('Bookings found successfully', {
        bookings,
        meta: {
          total,
          page,
          lastPage,
          hasNextPage: page < lastPage,
          hasPrevPage: page > 1,
        },
      });
    }
    const total = await this.prisma.booking.count();
    const bookings = await this.prisma.booking.findMany({
      skip,
      take: limit,
      orderBy,
      where: {
        pName: {
          contains: query.search,
        },
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
        commissionMax: true,
        commissionMin: true,
        status: true,
        pilot: {
          select: {
            name: true,
            id: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
        package: {
          select: {
            title: true,
            duration: true,
          },
        },
        pName: true,
        pId: true,
      },
    });
    const lastPage = Math.ceil(total / limit);

    if (!bookings) {
      throw new NotFoundException(responseHelper.error('Not found'));
    }
    return responseHelper.success('Bookings found successfully', {
      bookings,
      meta: {
        total,
        page,
        lastPage,
        hasNextPage: page < lastPage,
        hasPrevPage: page > 1,
      },
    });
  }

  async updateStatus(id: number, status: updateStatusDto, user: any) {
    let commissionMax: number = 0;
    let commissionMin: number = 0;
    let totalPrice: number = 0;

    const booking = await this.prisma.booking.findUnique({
      where: {
        id: id,
      },
    });
    const bookingAgency = await this.prisma.user.findUnique({
      where: {
        id: booking.userId,
      },
    });
    if (!booking) {
      throw new NotFoundException(responseHelper.error('Not found'));
    }
    const pack = await this.prisma.package.findUnique({
      where: {
        id: booking.packageId,
      },
    });
    if (!pack) {
      throw new NotFoundException(
        responseHelper.error('Package not found', pack),
      );
    }
    if (
      booking.nationality.toLocaleLowerCase() !== 'india' &&
      booking.nationality.toLocaleLowerCase() !== 'nepal'
    ) {
      if (pack.duration == '15' || pack.duration == '30') {
        if (status.status == 'SUCCESS')
          commissionMax =
            (15 *
              (booking.totalPrice -
                (booking.includes ? pack.includeMaxPrice : 0))) /
            100;
      } else {
        if (status.status == 'SUCCESS')
          commissionMax =
            (20 *
              (booking.totalPrice -
                (booking?.includes ? pack.includeMaxPrice : 0))) /
            100;
      }
    } else {
      if (pack.duration == '15' || pack.duration == '30') {
        if (status.status == 'SUCCESS')
          commissionMin =
            (10 *
              (booking.totalPrice -
                (booking?.includes ? pack.includeMinPrice : 0))) /
            100;
      } else {
        if (status.status == 'SUCCESS')
          commissionMin =
            (15 *
              (booking.totalPrice -
                (booking?.includes ? pack.includeMinPrice : 0))) /
            100;
      }
    }
    const bookingUpdate = await this.prisma.booking.update({
      where: {
        id: id,
      },

      data: {
        status: status.status,
        commissionMax: bookingAgency?.role == 'ADMIN' ? 0 : commissionMax,
        commissionMin: bookingAgency?.role == 'ADMIN' ? 0 : commissionMin,
      },
    });

    return responseHelper.success('Status updated successfully', bookingUpdate);
  }

  async updateInAirport(
    id: number,
    updateInAirportDto: UpdateInAirportDto,
    user: any,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        id: id,
      },
    });
    if (!booking) {
      throw new NotFoundException(responseHelper.error('Not found'));
    }
    await this.prisma.booking.update({
      where: {
        id: id,
      },
      data: {
        pilotId: updateInAirportDto.pilotId,
        aircraftId: updateInAirportDto.aircraftId,
      },
    });
    return responseHelper.success('Status updated successfully', booking);
  }

  async findOne(id: number, user: any) {
    if (user.role !="ADMIN") {
      const booking = await this.prisma.booking.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
        include: {
          pilot: true,
          package: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              contact: true,
              about: true,
              role: true,
            },
          },
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
      include: {
        pilot: true,
        package: true,

        user: {
          select: {
            id: true,
            name: true,
            email: true,
            contact: true,
            about: true,
            role: true,
          },
        },
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
      let commissionMin = 0;
      let commissionMax = 0;
      let flightType = updateBookingDto.flightType;
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
        if (flightType == 'COMMERCIAL') {
          if (
            updateBookingDto.nationality.toLocaleLowerCase() !== 'india' &&
            updateBookingDto.nationality.toLocaleLowerCase() !== 'nepal'
          ) {
            totalPrice = pack.maxPrice;
            // if (pack.duration == '15' || pack.duration == '30') {
            //   if (updateBookingDto.status == 'SUCCESS')
            //     commissionMax = (15 * totalPrice) / 100;
            // } else {
            //   if (updateBookingDto.status == 'SUCCESS')
            //     commissionMax = (20 * totalPrice) / 100;
            // }
            if (updateBookingDto.includes) {
              totalPrice += pack.includeMaxPrice;
            }
          } else {
            totalPrice = pack.minPrice;
            // if (pack.duration == '15' || pack.duration == '30') {
            //   if (updateBookingDto.status == 'SUCCESS')
            //     commissionMin = (10 * totalPrice) / 100;
            // } else {
            //   if (updateBookingDto.status == 'SUCCESS')
            //     commissionMin = (15 * totalPrice) / 100;
            // }

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
            discount: user?.role !== 'ADMIN' ? 0 : updateBookingDto.discount,
            prePayment:
              user?.role !== 'ADMIN' ? 0 : updateBookingDto.prePayment,
            flightType: updateBookingDto.flightType,
            paymentMethod: updateBookingDto.paymentMethod,
            includes: updateBookingDto.includes,
            pName: updateBookingDto.pName,
            pId: updateBookingDto.pId,
            identificationType: updateBookingDto.pIdType,
            ticketNo: updateBookingDto.ticketNo,
            aircraftType: updateBookingDto.aircraftType,
            commissionMin: user?.role == 'ADMIN' ? 0 : commissionMin,
            commissionMax: user?.role == 'ADMIN' ? 0 : commissionMax,
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
        if (updateBookingDto.flightType === 'COMMERCIAL') {
          if (
            updateBookingDto.nationality.toLocaleLowerCase() !== 'indian' &&
            updateBookingDto.nationality.toLocaleLowerCase() !== 'nepali'
          ) {
            totalPrice = pack.maxPrice;
            // commission = (updateBookingDto.commission * totalPrice) / 100;
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
            pilotId: updateBookingDto.pilotId,
            discount: updateBookingDto.discount,
            prePayment: updateBookingDto.prePayment,
            flightType: updateBookingDto.flightType,
            paymentMethod: updateBookingDto.paymentMethod,
            includes: updateBookingDto.includes,
            pName: updateBookingDto.pName,
            pId: updateBookingDto.pId,
            identificationType: updateBookingDto.pIdType,
            ticketNo: updateBookingDto.ticketNo,
            aircraftType: updateBookingDto.aircraftType,
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
  async removeAll() {
    const deletedBooking = await this.prisma.booking.deleteMany();
    return responseHelper.success(
      'All Booking deleted successfully',
      deletedBooking,
    );
  }
}
