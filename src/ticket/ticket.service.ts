import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from './entities/ticket.entity';
import { Model } from 'mongoose';
import { QrCodeService } from 'src/qr-code/qr-code.service';
import { Event } from 'src/events/entities/event.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(User.name) private userModel: Model<User>,
    private qrCodeService: QrCodeService,
  ) {}

  async buyTicket(eventId: string, userId: string) {
    if (!eventId || !userId) {
      throw new BadRequestException('Event ID and User ID must be provided');
    }

    const event = await this.eventModel.findById(eventId).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (event.soldTickets >= event.totalTickets) {
      throw new BadRequestException(`Event is sold out`);
    }

    const existingTicket = await this.ticketModel
      .findOne({ event: eventId, user: userId })
      .exec();
    if (existingTicket) {
      throw new BadRequestException(
        `User has already purchased a ticket for this event`,
      );
    }

    try {
      const qrCode = await this.qrCodeService.generateCode(
        `${eventId}-${userId}`,
      );
      const ticket = new this.ticketModel({
        event: eventId,
        user: userId,
        qrCode,
      });

      await ticket.save();

      await this.eventModel.findByIdAndUpdate(eventId, {
        $inc: { soldTickets: 1 },
        $push: { attendees: userId },
      });

      await this.userModel.findByIdAndUpdate(userId, {
        $push: { attendedEvents: eventId },
      });

      return ticket;
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred while purchasing the ticket: ${error.message}`,
      );
    }
  }

  async findByEvent(eventId: string) {
    if (!eventId) {
      throw new BadRequestException('Event ID must be provided');
    }

    const tickets = await this.ticketModel.find({ event: eventId }).exec();
    if (!tickets || tickets.length === 0) {
      throw new NotFoundException(
        `No tickets found for event with ID ${eventId}`,
      );
    }

    return tickets;
  }

  async findByAttendee(attendeeId: string) {
    if (!attendeeId) {
      throw new BadRequestException('Attendee ID must be provided');
    }

    const tickets = await this.ticketModel.find({ user: attendeeId }).exec();
    if (!tickets || tickets.length === 0) {
      throw new NotFoundException(
        `No tickets found for attendee with ID ${attendeeId}`,
      );
    }

    return tickets;
  }

  async scanTicket(id: string) {
    if (!id) {
      throw new BadRequestException('Ticket ID must be provided');
    }

    const ticket = await this.ticketModel.findById(id).exec();
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    if (ticket.isScanned) {
      throw new BadRequestException(
        `Ticket with ID ${id} has already been scanned`,
      );
    }

    try {
      ticket.isScanned = true;
      await ticket.save();
      return ticket;
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred while scanning the ticket: ${error.message}`,
      );
    }
  }
}
