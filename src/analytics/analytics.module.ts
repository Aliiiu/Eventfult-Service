import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from 'src/ticket/entities/ticket.entity';
import { EventSchema } from 'src/events/entities/event.entity';
import { CacheService } from 'src/cache/cache.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ticket.name, schema: TicketSchema },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, CacheService],
})
export class AnalyticsModule {}
