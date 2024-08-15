import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateEventCreatorDto } from 'src/users/dto/create-event-creator.dto';
import { CreateAttendeeDto } from 'src/users/dto/create-attendee.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
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

  @Post('validate-token')
  async validateToken(@Body() token: { token: string }) {
    return this.authService.validateToken(token.token);
  }
}
