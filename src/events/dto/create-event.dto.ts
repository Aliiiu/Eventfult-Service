import {
  IsString,
  IsDate,
  IsNotEmpty,
  IsArray,
  IsMongoId,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  reminderInterval: string;

  @IsMongoId()
  @IsNotEmpty()
  creator: string;

  @IsArray()
  @IsMongoId({ each: true })
  @Type(() => String)
  attendees: string[];

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  totalTickets: number;

  @IsNumber()
  @IsPositive()
  soldTickets: number;
}
