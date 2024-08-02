import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { Type } from 'class-transformer';

export class CreateEventCreatorDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  organizationName: string;

  @IsOptional()
  @IsUrl()
  organizationUrl?: string;

  @IsOptional()
  @IsString()
  organizationDescription?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Type(() => String)
  createdEvents?: string[];
}
