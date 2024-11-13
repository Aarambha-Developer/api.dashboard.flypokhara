import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
enum CraftType {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
}
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
  @ApiProperty()
  @IsEnum(CraftType) // This will validate the enum value
  aircraftType: CraftType;
}
