import { Injectable } from '@nestjs/common';
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
    return this.ticketModel.countDocuments({ event: eventId, isScanned: true });
  }

  async getEventTicketsSold(eventId: string) {
    return this.ticketModel.countDocuments({ event: eventId });
  }

  async getTotalAttendees(creatorId: string) {
    const events = await this.eventModel.find({ creator: creatorId });
    const eventIds = events.map((event) => event._id);
    return this.ticketModel.countDocuments({
      event: { $in: eventIds },
      isScanned: true,
    });
  }

  async getTotalTicketsSold(creatorId: string) {
    const events = await this.eventModel.find({ creator: creatorId });
    const eventIds = events.map((event) => event._id);
    return this.ticketModel.countDocuments({
      event: { $in: eventIds },
    });
  }
}
