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
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  event: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  scheduledFor: Date;

  @Prop({ default: false })
  isSent: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.virtual('id').get(function (this: Notification) {
  return this._id;
});
