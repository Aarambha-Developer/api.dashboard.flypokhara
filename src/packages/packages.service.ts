import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import responseHelper from 'src/helper/response-helper';

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPackageDto: CreatePackageDto) {
    const pack = await this.prisma.package.create({
      data: createPackageDto,
    });
    return responseHelper.success('package create successfully', pack);
  }

  async findAll() {
    const packs = await this.prisma.package.findMany({
      select: {
        id: true,
        title: true,
        includeMaxPrice: true,
        maxPrice: true,
        minPrice: true,
        includeMinPrice: true,
        duration: true,
      },
    });
    if (!packs) {
      throw new NotFoundException(
        responseHelper.error('There are packages in the database', packs),
      );
    }
    return responseHelper.success('Available Packages', packs);
  }

  async findOne(id: number) {
    const pack = await this.prisma.package.findUnique({
      where: {
        id: id,
      },
      select: {
        title: true,
        includeMaxPrice: true,
        maxPrice: true,
        minPrice: true,
        includeMinPrice: true,
        id: true,
      },
    });
    if (!pack) {
      throw new NotFoundException('No package with the given Id found');
    }
    return responseHelper.success('package found Successfully', pack);
  }

  async update(id: number, updatePackageDto: UpdatePackageDto) {
    const existPackage = await this.prisma.package.findUnique({
      where: {
        id: id,
      },
    });
    if (!existPackage) {
      throw new NotFoundException('No package with the given Id found');
    }
    const pack = await this.prisma.package.update({
      where: {
        id: id,
      },
      data: {
        ...updatePackageDto,
      },
    });
    return responseHelper.success('package updated Successfully', pack);
  }

  async remove(id: number) {
    const existPackage = await this.prisma.package.findUnique({
      where: {
        id: id,
      },
    });
    if (!existPackage) {
      throw new NotFoundException('No package with the given Id found');
    }
    const pack = await this.prisma.package.delete({
      where: {
        id: id,
      },
    });
    return responseHelper.success('package updated Successfully', pack);
  }
}
