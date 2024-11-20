import { ApiProperty } from '@nestjs/swagger';

export class CreateAircraftDto {
  @ApiProperty({ example: 'Airbus A320', required: true })
  aircraftNo: string;
}
