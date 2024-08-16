import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Request } from 'express';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

interface User {
  userId: string;
}

interface RequestWithUser extends Request {
  user: User;
}

@SkipThrottle()
@ApiTags('Ticket')
@Controller('ticket')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('buy-ticket')
  @Roles('attendee')
  @ApiOperation({ summary: 'Buy a ticket for an event' })
  @ApiBody({ type: CreateTicketDto })
  @ApiResponse({ status: 201, description: 'Ticket successfully purchased.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(
    @Body() createTicketDto: CreateTicketDto,
    @Req() req: RequestWithUser,
  ) {
    return this.ticketService.buyTicket(
      createTicketDto.event,
      req.user?.userId,
    );
  }

  @Get('attendee/:attendeeId')
  @ApiOperation({ summary: 'Get tickets by attendee ID' })
  @ApiParam({ name: 'attendeeId', description: 'ID of the attendee' })
  @ApiResponse({ status: 200, description: 'Tickets found.' })
  @ApiResponse({ status: 404, description: 'Tickets not found.' })
  findByAttendee(
    @Param('eventId') eventId: string,
    @Param('attendeeId') attendeeId: string,
  ) {
    return this.ticketService.findByAttendee(attendeeId);
  }

  @Get(':eventId')
  @ApiOperation({ summary: 'Get tickets by event ID' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  @ApiResponse({ status: 200, description: 'Tickets found.' })
  @ApiResponse({ status: 404, description: 'Tickets not found.' })
  findByEvent(@Param('eventId') eventId: string) {
    return this.ticketService.findByEvent(eventId);
  }

  @Patch(':id/scan')
  @ApiOperation({ summary: 'Scan a ticket by ID' })
  @ApiParam({ name: 'id', description: 'ID of the ticket' })
  @ApiResponse({ status: 200, description: 'Ticket successfully scanned.' })
  @ApiResponse({ status: 404, description: 'Ticket not found.' })
  scanTicket(@Param('id') id: string) {
    return this.ticketService.scanTicket(id);
  }
}
