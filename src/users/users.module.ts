import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import {
  EventCreator,
  EventCreatorSchema,
} from './entities/event-creator.entity';
import { Attendee, AttendeeSchema } from './entities/attendee.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: EventCreator.name, schema: EventCreatorSchema },
      { name: Attendee.name, schema: AttendeeSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
