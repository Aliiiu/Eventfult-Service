import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './entities/event.entity';
import { Model } from 'mongoose';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  async create(createEventDto: CreateEventDto, creatorId: string) {
    const createdEvent = new this.eventModel({
      ...createEventDto,
      creator: creatorId,
    });
    return createdEvent.save();
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
    return this.eventModel.find({ creator: creatorId }).exec();
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
