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

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
