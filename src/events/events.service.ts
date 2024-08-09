import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './entities/event.entity';
import { Model } from 'mongoose';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import { QrCodeService } from 'src/qr-code/qr-code.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectModel(Ticket.name) private readonly ticketModel: Model<Ticket>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly qrCodeService: QrCodeService,
  ) {}

  async create(createEventDto: CreateEventDto, creatorId: string) {
    const createdEvent = new this.eventModel({
      ...createEventDto,
      creator: creatorId,
    });
    await createdEvent.save();
    await this.userModel.findByIdAndUpdate(creatorId, {
      $push: { events: createdEvent.id },
    });
    return createdEvent;
  }

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
    return this.eventModel.find().exec();
  }

  async findOne(id: string) {
    const event = this.eventModel.findById(id).exec();
    if (!event) {
      throw new Error(`Event with id ${id} not found`);
    }
    return event;
  }

  async findByCreator(creatorId: string) {
    return this.eventModel.find({ creator: creatorId }).exec();
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const updatedEvent = await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .exec();

    if (!updatedEvent) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return updatedEvent;
  }

  async remove(id: string) {
    const deletedEvent = await this.eventModel.findByIdAndDelete(id).exec();

    if (!deletedEvent) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return deletedEvent;
  }
}
