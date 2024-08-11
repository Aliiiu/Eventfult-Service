import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  @IsMongoId()
  @IsNotEmpty()
  event: string;
}
