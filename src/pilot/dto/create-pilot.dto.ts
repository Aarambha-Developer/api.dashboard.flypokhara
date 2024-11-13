import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePilotDto {
  @IsString()
  @ApiProperty({ example: 'name', required: true })
  name: string;
}
