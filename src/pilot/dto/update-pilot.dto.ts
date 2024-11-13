import { PartialType } from '@nestjs/swagger';
import { CreatePilotDto } from './create-pilot.dto';

export class UpdatePilotDto extends PartialType(CreatePilotDto) {}
