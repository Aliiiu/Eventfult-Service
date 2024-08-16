import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      const createdEvent = new this.eventModel({
        ...createEventDto,
        creator: creatorId,
      });
      await createdEvent.save();

      await this.userModel.findByIdAndUpdate(creatorId, {
        $push: { events: createdEvent.id },
      });

      return createdEvent;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create event');
    }
  }

  async findAll() {
    try {
      return await this.eventModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve events');
    }
  }

  async findOne(id: string) {
    try {
      const event = await this.eventModel.findById(id).exec();

      if (!event) {
        throw new NotFoundException(`Event with id ${id} not found`);
      }

      return event;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve the event');
    }
  }

  async findByCreator(creatorId: string) {
    try {
      const events = await this.eventModel.find({ creator: creatorId }).exec();

      if (!events) {
        throw new NotFoundException(
          `No events found for creator with id ${creatorId}`,
        );
      }

      return events;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to retrieve events for creator',
      );
    }
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    try {
      const updatedEvent = await this.eventModel
        .findByIdAndUpdate(id, updateEventDto, { new: true })
        .exec();

      if (!updatedEvent) {
        throw new NotFoundException(`Event with id ${id} not found`);
      }

      return updatedEvent;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update event');
    }
  }

  async remove(id: string) {
    try {
      const deletedEvent = await this.eventModel.findByIdAndDelete(id).exec();

      if (!deletedEvent) {
        throw new NotFoundException(`Event with id ${id} not found`);
      }

      return deletedEvent;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete event');
    }
  }
}
