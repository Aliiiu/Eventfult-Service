import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  qrCode: string;

  @IsOptional()
  @IsBoolean()
  isScanned: boolean;

  @IsMongoId()
  @IsNotEmpty()
  user: string;

  @IsMongoId()
  @IsNotEmpty()
  event: string;
}
