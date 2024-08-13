import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Request } from 'express';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

interface User {
  userId: string; // Define other properties as needed
  // other properties like email, roles, etc.
}

interface RequestWithUser extends Request {
  user: User;
}

@Controller('ticket')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('buy-ticket')
  @Roles('attendee')
  create(
    @Body() createTicketDto: CreateTicketDto,
    @Req() req: RequestWithUser,
  ) {
    return this.ticketService.buyTicket(
      createTicketDto.event,
      req.user?.userId,
    );
  }

  @Get()
  findAll() {
    return this.ticketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(id);
  }

  @Get('attendee/:attendeeId')
  findByAttendee(
    @Param('eventId') eventId: string,
    @Param('attendeeId') attendeeId: string,
  ) {
    return this.ticketService.findByAttendee(attendeeId);
  }

  @Get(':eventId')
  findByEvent(@Param('eventId') eventId: string) {
    return this.ticketService.findByEvent(eventId);
  }

  @Patch(':id/scan')
  scanTicket(@Param('id') id: string) {
    return this.ticketService.scanTicket(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(id);
  }
}
