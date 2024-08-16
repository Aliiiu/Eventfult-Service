import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateEventCreatorDto } from 'src/users/dto/create-event-creator.dto';
import { CreateAttendeeDto } from 'src/users/dto/create-attendee.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Authenticate user with email and password' })
  @ApiBody({
    description: 'User login credentials',
    type: 'object',
    schema: {
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Successful authentication' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('login')
  async authenticate(@Body() loginDto: { email: string; password: string }) {
    return this.authService.authenticate(loginDto.email, loginDto.password);
  }

  @ApiOperation({ summary: 'Register a new event creator' })
  @ApiBody({ type: CreateEventCreatorDto })
  @ApiResponse({
    status: 201,
    description: 'Event creator registered successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('register/creator')
  async registerEventCreator(
    @Body() createEventCreatorDto: CreateEventCreatorDto,
  ) {
    return this.authService.registerEventCreator(createEventCreatorDto);
  }

  @ApiOperation({ summary: 'Register a new attendee' })
  @ApiBody({ type: CreateAttendeeDto })
  @ApiResponse({ status: 201, description: 'Attendee registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('register/attendee')
  async registerAttendee(@Body() createAttendeeDto: CreateAttendeeDto) {
    return this.authService.registerAttendee(createAttendeeDto);
  }

  @ApiOperation({ summary: 'Validate an authentication token' })
  @ApiBody({
    description: 'JWT token to validate',
    type: 'object',
    schema: {
      properties: {
        token: { type: 'string', example: 'your.jwt.token.here' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 401, description: 'Token is invalid or expired' })
  @Post('validate-token')
  async validateToken(@Body() token: { token: string }) {
    return this.authService.validateToken(token.token);
  }
}
