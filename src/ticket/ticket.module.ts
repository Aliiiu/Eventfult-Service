import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './entities/ticket.entity';
import { QrCodeModule } from 'src/qr-code/qr-code.module';
import { EventsModule } from 'src/events/events.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    QrCodeModule,
    EventsModule,
    UsersModule,
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    QrCodeModule,
  ],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService, MongooseModule],
})
export class TicketModule {}
