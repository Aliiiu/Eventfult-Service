import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
// import { Roles } from 'src/auth/roles.decorator';

@Controller('analytics')
@UseGuards(AuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('event-attendees/:eventId')
  // @Roles('creator')
  getEventAttendees(@Param('eventId') eventId: string) {
    return this.analyticsService.getEventAttendees(eventId);
  }

  @Get('event-tickets-sold/:eventId')
  // @Roles('creator')
  getEventTicketsSold(@Param('eventId') eventId: string) {
    return this.analyticsService.getEventTicketsSold(eventId);
  }

  @Get('total-attendees/:creatorId')
  // @Roles('creator')
  getTotalAttendees(@Param('creatorId') creatorId: string) {
    return this.analyticsService.getTotalAttendees(creatorId);
  }

  @Get('total-tickets-sold/:creatorId')
  // @Roles('creator')
  getTotalTicketsSold(@Param('creatorId') creatorId: string) {
    return this.analyticsService.getTotalTicketsSold(creatorId);
  }
}
