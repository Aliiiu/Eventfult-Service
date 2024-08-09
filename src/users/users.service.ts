import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { CreateEventCreatorDto } from './dto/create-event-creator.dto';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateEventCreatorDto } from './dto/update-event-creator.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    // @InjectModel(EventCreator.name)
    // private eventCreatorModel: Model<EventCreator>,
    // @InjectModel(Attendee.name) private attendeeModel: Model<Attendee>,
  ) {}

  async createEventCreator(createEventCreatorDto: CreateEventCreatorDto) {
    const createdEventCreator = new this.userModel(createEventCreatorDto);
    return createdEventCreator.save();
  }

  async createAttendee(createAttendeeDto: CreateAttendeeDto) {
    const createdAttendee = new this.userModel(createAttendeeDto);
    return createdAttendee.save();
  }

  async findAllEventCreators() {
    return this.userModel.find().exec();
  }

  async findAllAttendees() {
    return this.userModel.find().exec();
  }

  async findEventCreatorById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async findAttendeeById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
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
