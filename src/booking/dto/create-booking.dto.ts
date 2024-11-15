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
  @ApiProperty({ example: 'Nepali', required: true })
  @IsString({ message: 'Nationality is required' })
  nationality: string;
  @ApiProperty({ example: 200, required: false })
  @IsNumber()
  @IsOptional()
  prePayment: number;
  @ApiProperty({ example: 100, required: false })
  @IsNumber()
  @IsOptional()
  discount: number;
  @ApiProperty({ example: 'COMMERICAL', required: true })
  @IsString({ message: 'Flight Type Must be COMMERICAL|FREE|TRAINING|TEST' })
  @IsOptional()
  flightType: string;
  @ApiProperty({ example: 'CASH', required: true })
  @IsEnum(Method)
  @IsOptional()
  paymentMethod: Method;

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
  @ApiProperty()
  @IsEnum(CraftType) // This will validate the enum value
  @IsOptional()
  aircraftType: CraftType;
}
