import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateEventCreatorDto } from 'src/users/dto/create-event-creator.dto';
import { CreateAttendeeDto } from 'src/users/dto/create-attendee.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async authenticate(@Body() loginDto: { email: string; password: string }) {
    return this.authService.authenticate(loginDto.email, loginDto.password);
  }

  @Post('register/creator')
  async registerEventCreator(
    @Body() createEventCreatorDto: CreateEventCreatorDto,
  ) {
    return this.authService.registerEventCreator(createEventCreatorDto);
  }

  @Post('register/attendee')
  async registerAttendee(@Body() createAttendeeDto: CreateAttendeeDto) {
    return this.authService.registerAttendee(createAttendeeDto);
  }
}
