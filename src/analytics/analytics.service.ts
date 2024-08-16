import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from 'src/events/entities/event.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
  ) {}

  async getEventAttendees(eventId: string) {
    try {
      const attendeesCount = await this.ticketModel.countDocuments({
        event: eventId,
        isScanned: true,
      });
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

  async getEventTicketsSold(eventId: string) {
    try {
      const ticketsSoldCount = await this.ticketModel.countDocuments({
        event: eventId,
      });
      if (!ticketsSoldCount) {
        throw new NotFoundException(
          `No tickets sold found for event with ID ${eventId}`,
        );
      }
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

  async getTotalAttendees(creatorId: string): Promise<number> {
    try {
      const events = await this.findEventsByCreator(creatorId);
      const eventIds = events.map((event) => event._id);
      const totalAttendees = await this.ticketModel.countDocuments({
        event: { $in: eventIds },
        isScanned: true,
      });
      return totalAttendees;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to get total attendees: ${error.message}`,
      );
    }
  }

  async getTotalTicketsSold(creatorId: string): Promise<number> {
    try {
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
