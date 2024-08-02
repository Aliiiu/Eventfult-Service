import { PartialType } from '@nestjs/mapped-types';
import { CreateEventCreatorDto } from './create-event-creator.dto';

export class UpdateEventCreatorDto extends PartialType(CreateEventCreatorDto) {}
