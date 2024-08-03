import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from './entities/ticket.entity';
import { Model } from 'mongoose';
import { QrCodeService } from 'src/qr-code/qr-code.service';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    private qrCodeService: QrCodeService,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    const ticket = new this.ticketModel(createTicketDto);
    const savedTicket = await ticket.save();

    const qrCode = await this.qrCodeService.generateCode(
      savedTicket.id.toString(),
    );
    savedTicket.qrCode = qrCode;

    return savedTicket.save();
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
