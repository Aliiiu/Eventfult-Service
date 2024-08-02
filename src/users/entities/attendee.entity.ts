import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.entity';
import { Types } from 'mongoose';

@Schema()
export class Attendee extends User {
  @Prop()
  phoneNumber?: string;

  @Prop()
  location?: string;

  @Prop({ type: [String] })
  interests?: string[];

  @Prop({ type: Types.ObjectId, ref: 'Event' })
  attendedEvents: Types.ObjectId[];
}

export const AttendeeSchema = SchemaFactory.createForClass(Attendee);
