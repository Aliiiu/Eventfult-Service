import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateEventCreatorDto } from './dto/update-event-creator.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('event-creators')
  @ApiOperation({ summary: 'Retrieve all event creators' })
  @ApiResponse({ status: 200, description: 'List of all event creators' })
  findAllEventCreators() {
    return this.usersService.findAllEventCreators();
  }

  @Get('attendees')
  @ApiOperation({ summary: 'Retrieve all attendees' })
  @ApiResponse({ status: 200, description: 'List of all attendees' })
  findAllAttendees() {
    return this.usersService.findAllAttendees();
  }

  @Get('event-creator/:id')
  @ApiOperation({ summary: 'Retrieve an event creator by ID' })
  @ApiParam({ name: 'id', description: 'ID of the event creator' })
  @ApiResponse({ status: 200, description: 'The event creator' })
  @ApiResponse({ status: 404, description: 'Event creator not found' })
  findEventCreatorById(@Param('id') id: string) {
    return this.usersService.findEventCreatorById(id);
  }

  @Get('attendee/:id')
  @ApiOperation({ summary: 'Retrieve an attendee by ID' })
  @ApiParam({ name: 'id', description: 'ID of the attendee' })
  @ApiResponse({ status: 200, description: 'The attendee' })
  @ApiResponse({ status: 404, description: 'Attendee not found' })
  findAttendeeById(@Param('id') id: string) {
    return this.usersService.findAttendeeById(id);
  }

  @Patch('event-creator/:id')
  @ApiOperation({ summary: 'Update an event creator' })
  @ApiParam({ name: 'id', description: 'ID of the event creator' })
  @ApiResponse({ status: 200, description: 'Updated event creator' })
  @ApiResponse({ status: 404, description: 'Event creator not found' })
  updateEventCreator(
    @Param('id') id: string,
    @Body() updateEventCreator: UpdateEventCreatorDto,
  ) {
    return this.usersService.updateEventCreator(id, updateEventCreator);
  }

  @Delete(':id')
  @Roles('creator')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'ID of the user' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
