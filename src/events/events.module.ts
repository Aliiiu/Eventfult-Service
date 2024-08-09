import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event, EventSchema } from './entities/event.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { QrCodeModule } from 'src/qr-code/qr-code.module';
import { TicketModule } from 'src/ticket/ticket.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    QrCodeModule,
    TicketModule,
    UsersModule,
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
