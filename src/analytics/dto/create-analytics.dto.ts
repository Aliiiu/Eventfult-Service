import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAnalyticsDto {
  @IsMongoId()
  @IsNotEmpty()
  event: string;

  @IsNumber()
  attendeeCount: number;

  @IsNumber()
  ticketSold: number;

  @IsNumber()
  scannedTicket: number;
}
