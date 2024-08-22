import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('analytics')
@UseGuards(AuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('event-attendees/:eventId')
  @Roles('creator')
  @ApiOperation({ summary: 'Get total attendees specific to this event' })
  @ApiParam({ name: 'eventId', type: String, description: 'ID of the event' })
  @ApiResponse({
    status: 200,
    description: 'Total number of attendees specific to this event',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getEventAttendees(@Param('eventId') eventId: string) {
    return this.analyticsService.getTotalEventAttendees(eventId);
  }

  @Get('total-attendees/:creatorId')
  @Roles('creator')
  @ApiOperation({
    summary: 'Get total attendees this creator has had all time',
  })
  @ApiParam({
    name: 'creatorId',
    type: String,
    description: 'ID of the creator',
  })
  @ApiResponse({ status: 200, description: 'Total number of attendees' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getTotalAttendees(@Param('creatorId') creatorId: string) {
    return this.analyticsService.getTotalAttendees(creatorId);
  }

  @Get('event-tickets-sold/:eventId')
  @Roles('creator')
  @ApiOperation({ summary: 'Get event tickets sold' })
  @ApiParam({ name: 'eventId', type: String, description: 'ID of the event' })
  @ApiResponse({ status: 200, description: 'Number of tickets sold' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getEventTicketsSold(@Param('eventId') eventId: string) {
    return this.analyticsService.getEventTicketsSold(eventId);
  }

  @Get('total-tickets-sold/:creatorId')
  @Roles('creator')
  @ApiOperation({ summary: 'Get total tickets sold by creator' })
  @ApiParam({
    name: 'creatorId',
    type: String,
    description: 'ID of the creator',
  })
  @ApiResponse({ status: 200, description: 'Total number of tickets sold' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getTotalTicketsSold(@Param('creatorId') creatorId: string) {
    return this.analyticsService.getTotalTicketsSold(creatorId);
  }
}
