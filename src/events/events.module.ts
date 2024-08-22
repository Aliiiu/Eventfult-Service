import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event, EventSchema } from './entities/event.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { QrCodeModule } from 'src/qr-code/qr-code.module';
import { UsersModule } from 'src/users/users.module';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    QrCodeModule,
    UsersModule,
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [EventsController],
  providers: [EventsService, RedisService],
  exports: [EventsService, MongooseModule],
})
export class EventsModule {}
