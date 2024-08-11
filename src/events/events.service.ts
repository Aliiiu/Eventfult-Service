import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './entities/event.entity';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createEventDto: CreateEventDto, creatorId: string) {
    const createdEvent = new this.eventModel({
      ...createEventDto,
      creator: creatorId,
    });
    await createdEvent.save();
    await this.userModel.findByIdAndUpdate(creatorId, {
      $push: { events: createdEvent.id },
    });
    return createdEvent;
  }

  async findAll() {
    return this.eventModel.find().exec();
  }

  async findOne(id: string) {
    const event = this.eventModel.findById(id).exec();
    if (!event) {
      throw new Error(`Event with id ${id} not found`);
    }
    return event;
  }

  async findByCreator(creatorId: string) {
    const events = await this.eventModel.find({ creator: creatorId }).exec();
    if (!events) {
      throw new NotFoundException(`No events found`);
    }
    return events;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const updatedEvent = await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .exec();

    if (!updatedEvent) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return updatedEvent;
  }

  async remove(id: string) {
    const deletedEvent = await this.eventModel.findByIdAndDelete(id).exec();

    if (!deletedEvent) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return deletedEvent;
  }
}
