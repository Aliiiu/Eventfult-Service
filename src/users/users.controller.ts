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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateEventCreatorDto } from './dto/update-event-creator.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post('event-creator')
  // @Roles('creator')
  // createEventCreator(@Body() createEventCreatorDto: CreateEventCreatorDto) {
  //   return this.usersService.createEventCreator(createEventCreatorDto);
  // }
  // @Post('attendee')
  // createAttendee(@Body() createEventCreatorDto: CreateEventCreatorDto) {
  //   return this.usersService.createEventCreator(createEventCreatorDto);
  // }

  @Get('event-creators')
  findAllEventCreators() {
    return this.usersService.findAllEventCreators();
  }

  @Get('attendees')
  findAllAttendees() {
    return this.usersService.findAllEventCreators();
  }

  @Get('event-creator/:id')
  findEventCreatorById(@Param('id') id: string) {
    return this.usersService.findEventCreatorById(id);
  }

  @Get('event-creator/:id')
  findAttendeeById(@Param('id') id: string) {
    return this.usersService.findAttendeeById(id);
  }

  @Patch('event-creator/:id')
  updateEventCreator(
    @Param('id') id: string,
    @Body() updateEventCreator: UpdateEventCreatorDto,
  ) {
    return this.usersService.updateEventCreator(id, updateEventCreator);
  }

  @Delete(':id')
  @Roles('creator')
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
