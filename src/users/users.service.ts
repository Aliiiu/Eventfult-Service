import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { CreateEventCreatorDto } from './dto/create-event-creator.dto';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateEventCreatorDto } from './dto/update-event-creator.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createEventCreator(createEventCreatorDto: CreateEventCreatorDto) {
    try {
      const createdEventCreator = new this.userModel(createEventCreatorDto);
      return await createdEventCreator.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create event creator');
    }
  }

  async createAttendee(createAttendeeDto: CreateAttendeeDto) {
    try {
      const createdAttendee = new this.userModel(createAttendeeDto);
      return await createdAttendee.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create attendee');
    }
  }

  async findAllEventCreators() {
    try {
      return await this.userModel.find({ userType: 'creator' }).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve event creators',
      );
    }
  }

  async findAllAttendees() {
    try {
      return await this.userModel.find({ userType: 'attendee' }).exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve attendees');
    }
  }

  async findEventCreatorById(id: string) {
    try {
      const eventCreator = await this.userModel.findById(id).exec();
      if (!eventCreator || eventCreator.userType !== 'creator') {
        throw new NotFoundException('Event creator not found');
      }
      return eventCreator;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to retrieve event creator',
      );
    }
  }

  async findAttendeeById(id: string) {
    try {
      const attendee = await this.userModel.findById(id).exec();
      if (!attendee || attendee.userType !== 'attendee') {
        throw new NotFoundException('Attendee not found');
      }
      return attendee;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve attendee');
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      if (!user) {
        throw new NotFoundException('User with this email not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to retrieve user by email',
      );
    }
  }

  async findById(id: string) {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async updateEventCreator(
    id: string,
    updateEventCreatorDto: UpdateEventCreatorDto,
  ) {
    const updatedEventCreator = await this.userModel
      .findByIdAndUpdate(id, updateEventCreatorDto, { new: true })
      .exec();

    if (!updatedEventCreator) {
      throw new NotFoundException(`Event Creator with id ${id} not found`);
    }
    return updatedEventCreator;
  }

  async updateAttendee(id: string, updateAttendeeDto: UpdateAttendeeDto) {
    const updatedAttendee = await this.userModel
      .findByIdAndUpdate(id, updateAttendeeDto, { new: true })
      .exec();

    if (!updatedAttendee) {
      throw new NotFoundException(`Attendee with id ${id} not found`);
    }
    return updatedAttendee;
  }

  async deleteUser(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

    if (!deletedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return deletedUser;
  }
}
