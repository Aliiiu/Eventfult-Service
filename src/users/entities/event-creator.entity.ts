import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.entity';
import { Types } from 'mongoose';

@Schema()
export class EventCreator extends User {
  @Prop({ required: true })
  organizationName: string;

  @Prop()
  organizationDescription?: string;

  @Prop()
  organizationWebsite?: string;

  @Prop({ type: Types.ObjectId, ref: 'Event' })
  createdEvents: Types.ObjectId[];
}

export const EventCreatorSchema = SchemaFactory.createForClass(EventCreator);
