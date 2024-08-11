import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTicketDto } from './dto/update-ticket.dto';
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
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) {
      throw new NotFoundException(`Event not found`);
    }

    if (event.soldTickets >= event.totalTickets) {
      throw new BadRequestException(`Event is sold out`);
    }

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
  }

  async findAll() {
    return this.ticketModel.find();
  }

  async findOne(id: string) {
    return this.ticketModel.findById(id);
  }

  async findByEvent(eventId: string) {
    return this.ticketModel.find({ event: eventId });
  }

  async findByAttendee(attendeeId: string) {
    return this.ticketModel.find({ user: attendeeId });
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    const updatedTicket = await this.ticketModel.findByIdAndUpdate(
      id,
      updateTicketDto,
      { new: true },
    );

    if (!updatedTicket) {
      throw new NotFoundException('Ticket not found');
    }

    return updatedTicket;
  }

  async scanTicket(id: string) {
    const ticket = await this.ticketModel.findById(id);
    ticket.isScanned = true;
    return ticket.save();
  }

  async remove(id: string) {
    const deletedTicket = await this.ticketModel.findByIdAndDelete(id);

    if (!deletedTicket) {
      throw new NotFoundException('Ticket not found');
    }

    return deletedTicket;
  }
}
