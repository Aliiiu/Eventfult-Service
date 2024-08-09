import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateEventCreatorDto } from 'src/users/dto/create-event-creator.dto';
import { CreateAttendeeDto } from 'src/users/dto/create-attendee.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new Error('No user found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    return user;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      userType: user.userType,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async authenticate(email: string, password: string) {
    const user = await this.validateUser(email, password);
    return this.login(user);
  }

  async registerEventCreator(createEventCreatorDto: CreateEventCreatorDto) {
    const existingUser = await this.usersService.findByEmail(
      createEventCreatorDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(
      createEventCreatorDto.password,
      10,
    );

    const creator = await this.usersService.createEventCreator({
      ...createEventCreatorDto,
      password: hashedPassword,
      userType: 'creator',
    });
    return creator.toObject();
  }

  async registerAttendee(createAttendeeDto: CreateAttendeeDto) {
    const existingUser = await this.usersService.findByEmail(
      createAttendeeDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createAttendeeDto.password, 10);

    const attendee = await this.usersService.createAttendee({
      ...createAttendeeDto,
      password: hashedPassword,
      userType: 'attendee',
    });
    return attendee.toObject();
  }
}
