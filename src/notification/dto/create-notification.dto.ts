import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateNotificationDto {
  @IsMongoId()
  @IsNotEmpty()
  user: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsMongoId()
  @IsNotEmpty()
  event: string;

  @IsBoolean()
  isSent: boolean;

  @IsDate()
  @Type(() => Date)
  scheduledFor: Date;
}
