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
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly redisService: RedisService,
  ) {}

  async create(createEventDto: CreateEventDto, creatorId: string) {
    try {
      const createdEvent = new this.eventModel({
        ...createEventDto,
        creator: creatorId,
      });
      await createdEvent.save();

      await this.redisService.set(
        `event:${createdEvent.id}`,
        createdEvent,
        60 * 1000,
      );

      await this.userModel.findByIdAndUpdate(creatorId, {
        $push: { events: createdEvent.id },
      });

      return createdEvent;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to create event');
    }
  }

  async findAll() {
    try {
      const cachedEvents = await this.redisService.get('events');

      if (cachedEvents) {
        return cachedEvents;
      }

      const events = await this.eventModel.find().exec();

      await this.redisService.set('events', events, 60 * 1000);

      return events;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to retrieve events');
    }
  }

  async findOne(id: string) {
    try {
      const cachedEvents = await this.redisService.get(`event:${id}`);

      if (cachedEvents) {
        return cachedEvents;
      }
      const event = await this.eventModel.findById(id).exec();

      if (event) {
        await this.redisService.set(`event:${id}`, event, 60 * 1000);
      }

      if (!event) {
        throw new NotFoundException(`Event with id ${id} not found`);
      }

      return event;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve the event');
    }
  }

  async findByCreator(creatorId: string) {
    try {
      const cachedEvents = await this.redisService.get(
        `eventCreator:${creatorId}`,
      );

      if (cachedEvents) {
        return cachedEvents;
      }
      const events = await this.eventModel.find({ creator: creatorId }).exec();

      if (events) {
        await this.redisService.set(
          `eventCreator:${creatorId}`,
          events,
          60 * 1000,
        );
      }

      if (!events) {
        throw new NotFoundException(
          `No events found for creator with id ${creatorId}`,
        );
      }

      return events;
    } catch (error) {
      console.log(error);
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

      if (updatedEvent) {
        await this.redisService.set(`event:${id}`, updatedEvent, 60 * 1000);
      } else {
        await this.redisService.del(`event:${id}`);
      }

      if (!updatedEvent) {
        throw new NotFoundException(`Event with id ${id} not found`);
      }

      return updatedEvent;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update event');
    }
  }

  async remove(id: string) {
    try {
      const deletedEvent = await this.eventModel.findByIdAndDelete(id).exec();

      if (deletedEvent) {
        await this.redisService.del(`event:${id}`);
      }

      if (!deletedEvent) {
        throw new NotFoundException(`Event with id ${id} not found`);
      }

      return deletedEvent;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete event');
    }
  }
}
