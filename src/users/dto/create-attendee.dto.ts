import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { Type } from 'class-transformer';

export class CreateAttendeeDto extends CreateUserDto {
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Type(() => String)
  attendedEvents?: string[];
}
