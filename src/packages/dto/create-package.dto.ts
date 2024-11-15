import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreatePackageDto {
  @ApiProperty()
  @IsString()
  title: string;
  @IsNumber()
  @ApiProperty()
  minPrice: number;
  @ApiProperty()
  @IsNumber()
  maxPrice: number;
  @ApiProperty()
  @IsString()
  duration: string;
  @ApiProperty()
  @IsNumber()
  includeMinPrice: number;
  @ApiProperty()
  @IsNumber()
  includeMaxPrice: number;

}
