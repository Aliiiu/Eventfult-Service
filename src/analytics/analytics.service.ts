import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CacheService } from 'src/cache/cache.service';
import { Event } from 'src/events/entities/event.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
    private cachService: CacheService,
  ) {}

  async getTotalEventAttendees(eventId: string) {
    try {
      const cachedEventAttendeesCount = await this.cachService.get(
        `event:${eventId}:attendeesCount`,
      );

      if (cachedEventAttendeesCount) {
        return Number(cachedEventAttendeesCount);
      }

      const attendeesCount = await this.ticketModel.countDocuments({
        event: eventId,
        isScanned: true,
      });

      await this.cachService.set(
        `event:${eventId}:attendeesCount`,
        attendeesCount,
        60 * 1000,
      );

      if (!attendeesCount) {
        throw new NotFoundException(
          `No attendees found for event with ID ${eventId}`,
        );
      }
      return attendeesCount;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to get event attendees: ${error.message}`,
      );
    }
  }

  async getTotalAttendees(creatorId: string) {
    try {
      const cacheKey = `creator:${creatorId}:allTimeAttendeesCount`;
      const cachedAllTimeAttendeesCount = await this.cachService.get(cacheKey);

      if (cachedAllTimeAttendeesCount) {
        return Number(cachedAllTimeAttendeesCount);
      }
      const events = await this.findEventsByCreator(creatorId);
      const eventIds = events.map((event) => event._id);
      const totalAttendees = await this.ticketModel.countDocuments({
        event: { $in: eventIds },
        isScanned: true,
      });

      await this.cachService.set(cacheKey, totalAttendees, 60 * 1000);
      return totalAttendees;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to get total attendees: ${error.message}`,
      );
    }
  }

  async getEventTicketsSold(eventId: string) {
    try {
      const cacheKey = `event:${eventId}:ticketsSoldCount`;
      const cachedTicketsSoldCount = await this.cachService.get(cacheKey);

      if (cachedTicketsSoldCount) {
        return Number(cachedTicketsSoldCount);
      }

      const ticketsSoldCount = await this.ticketModel.countDocuments({
        event: eventId,
      });
      if (!ticketsSoldCount) {
        throw new NotFoundException(
          `No tickets sold found for event with ID ${eventId}`,
        );
      }

      await this.cachService.set(cacheKey, ticketsSoldCount, 60 * 1000);
      return ticketsSoldCount;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to get event tickets sold: ${error.message}`,
      );
    }
  }

  private async findEventsByCreator(creatorId: string): Promise<Event[]> {
    try {
      const events = await this.eventModel.find({ creator: creatorId }).exec();
      if (!events.length) {
        throw new NotFoundException(
          `No events found for creator with ID ${creatorId}`,
        );
      }
      return events;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to find events: ${error.message}`,
      );
    }
  }

  async getTotalTicketsSold(creatorId: string) {
    try {
      const cacheKey = `creator:${creatorId}:totalTicketsSold`;
      const cachedTotalTicketsSold = await this.cachService.get(cacheKey);

      if (cachedTotalTicketsSold) {
        return Number(cachedTotalTicketsSold);
      }
      const events = await this.findEventsByCreator(creatorId);
      const eventIds = events.map((event) => event._id);
      const totalTicketsSold = await this.ticketModel.countDocuments({
        event: { $in: eventIds },
      });
      return totalTicketsSold;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to get total tickets sold: ${error.message}`,
      );
    }
  }
}
