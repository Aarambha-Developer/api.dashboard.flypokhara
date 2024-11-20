import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

enum Method {
  CASH = 'CASH',
  CARD = 'CARD',
  CREDIT = 'CREDIT',
  ONLINE = 'ONLINE',
}

// enum FlightType {
//   COMMERICAL = 'COMMERICAL',
//   FREE = 'FREE',
//   TRAINING = 'TRAINING',
//   TEST = 'TEST',
// }

enum CraftType {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
}
export class CreateBookingDto {
  @ApiProperty({ example: '2023-01-01', required: true })
  @IsString({ message: 'Flight Date is required' })
  flightDate: string;
  @ApiProperty({ example: 'nepal', required: true })
  @IsString({ message: 'Nationality is required' })
  nationality: string;
  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @IsOptional()
  prePayment: number;
  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @IsOptional()
  discount: number;
  @ApiProperty({ example: 'COMMERCIAL', required: true })
  @IsString({ message: 'Flight Type Must be COMMERICAL|FREE|TRAINING|TEST' })
  @IsOptional()
  flightType: string;
  @ApiProperty({ example: 'CASH', required: true })
  @IsEnum(Method)
  @IsOptional()
  paymentMethod: Method|undefined;

  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  packageId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  pilotId: number;
  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  includes: boolean;
  // @ApiProperty({ example: 100, required: false })
  // @IsNumber()
  // @IsOptional()
  // commission: number;
  @IsString()
  @ApiProperty({ example: 'name', required: false })
  pName: string;
  @ApiProperty()
  @IsString()
  pId: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  ticketNo: string;
  @ApiProperty()
  @IsString({ message: 'Identification Type is required' })
  pIdType: string;
  @ApiProperty({ example: 'OPEN', required: true })
  @IsEnum(CraftType) // This will validate the enum value
  @IsOptional()
  aircraftType: CraftType;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  aircraftId: number;
}

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number (starts from 1)',
    default: 1,
    minimum: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    minimum: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'asc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';

  @ApiPropertyOptional({
    description: 'Search query',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  search?: string;
}

enum updateEnum {
  SUCCESS = 'SUCCESS',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
  REFUNDED = 'REFUNDED',
}
export class updateStatusDto {
  @IsEnum(updateEnum)
  @ApiProperty({ example: 'SUCCESS', required: true })
  status: updateEnum;
}
export class UpdateInAirportDto {
  @ApiProperty({ example: 1, required: true })
  pilotId: number;

  @ApiProperty({ example: 1, required: true })
  aircraftId: number;
}
