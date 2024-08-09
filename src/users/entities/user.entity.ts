import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    },
  },
  toObject: {
    virtuals: true,
  },
})
export class User extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  username: string;

  @Prop({ type: String, enum: ['creator', 'attendee'], required: true })
  userType: string;

  @Prop()
  organizationName?: string;

  @Prop()
  organizationDescription?: string;

  @Prop()
  organizationWebsite?: string;

  @Prop({ type: Types.ObjectId, ref: 'Event' })
  createdEvents?: Types.ObjectId[];

  @Prop()
  phoneNumber?: string;

  @Prop()
  location?: string;

  @Prop({ type: [String] })
  interests?: string[];

  @Prop({ type: Types.ObjectId, ref: 'Event' })
  attendedEvents?: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function (this: Document) {
  return this._id;
});
