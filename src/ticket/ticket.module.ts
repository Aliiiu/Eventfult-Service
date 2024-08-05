import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './entities/ticket.entity';
import { QrCodeModule } from 'src/qr-code/qr-code.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    QrCodeModule,
  ],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
