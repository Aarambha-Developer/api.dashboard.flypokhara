import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

enum Method {
  CASH = 'CASH',
  CARD = 'CARD',
  CREDIT = 'CREDIT',
  ONLINE = 'ONLINE',
}

enum FlightType {
  COMMERICAL = 'COMMERICAL',
  FREE = 'FREE',
  TRAINING = 'TRAINING',
  TEST = 'TEST',
}

export class CreateBookingDto {
  @ApiProperty({ example: '2023-01-01', required: true })
  @IsString({ message: 'Flight Date is required' })
  flightDate: string;
  @ApiProperty({ example: 'Nepali', required: true })
  @IsString({ message: 'Nationality is required' })
  nationality: string;
  @ApiProperty({ example: 200, required: false })
  @IsNumber()
  prePayment: number;
  @ApiProperty({ example: 100, required: false })
  @IsNumber()
  discount: number;
  @ApiProperty({ example: 'COMMERICAL', required: true })
  @IsEnum(FlightType)
  flightType: FlightType;

  @ApiProperty({ example: 'CASH', required: true })
  @IsEnum(Method)
  paymentMethod: Method;

  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  packageId: number;

  @ApiProperty()
  @IsNumber()
  pilotId: number;
  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  includes: boolean;
  @ApiProperty({ example: 100, required: false })
  @IsNumber()
  @IsOptional()
  commission: number;
  @IsString()
  @ApiProperty({ example: 'name', required: false })
  pName: string;
  @ApiProperty()
  @IsString()
  pId: string;
  @ApiProperty()
  @IsString()
  ticketNo: string;
  @ApiProperty()
  @IsString({ message: 'Identification Type is required' })
  identificationType: string;
}
