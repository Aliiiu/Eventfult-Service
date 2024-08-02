import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { EventCreator } from './entities/event-creator.entity';
import { Attendee } from './entities/attendee.entity';
import { CreateEventCreatorDto } from './dto/create-event-creator.dto';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateEventCreatorDto } from './dto/update-event-creator.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(EventCreator.name)
    private eventCreatorModel: Model<EventCreator>,
    @InjectModel(Attendee.name) private attendeeModel: Model<Attendee>,
  ) {}

  async createEventCreator(createEventCreatorDto: CreateEventCreatorDto) {
    const createdEventCreator = new this.eventCreatorModel(
      createEventCreatorDto,
    );
    return createdEventCreator.save();
  }

  async createAttendee(createAttendeeDto: CreateAttendeeDto) {
    const createdAttendee = new this.attendeeModel(createAttendeeDto);
    return createdAttendee.save();
  }

  async findAllEventCreators() {
    return this.eventCreatorModel.find().exec();
  }

  async findAllAttendees() {
    return this.attendeeModel.find().exec();
  }

  async findEventCreatorById(id: string) {
    return this.eventCreatorModel.findById(id).exec();
  }

  async findAttendeeById(id: string) {
    return this.attendeeModel.findById(id).exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async updateEventCreator(
    id: number,
    updateEventCreatorDto: UpdateEventCreatorDto,
  ) {
    const updatedEventCreator = await this.eventCreatorModel
      .findByIdAndUpdate(id, updateEventCreatorDto, { new: true })
      .exec();

    if (!updatedEventCreator) {
      throw new NotFoundException(`Event Creator with id ${id} not found`);
    }
    return updatedEventCreator;
  }

  async updateAttendee(id: number, updateAttendeeDto: UpdateAttendeeDto) {
    const updatedAttendee = await this.attendeeModel
      .findByIdAndUpdate(id, updateAttendeeDto, { new: true })
      .exec();

    if (!updatedAttendee) {
      throw new NotFoundException(`Attendee with id ${id} not found`);
    }
    return updatedAttendee;
  }

  async deleteUser(id: number) {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

    if (!deletedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return deletedUser;
  }
}
