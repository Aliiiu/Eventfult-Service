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
export class Analytics extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  event: Types.ObjectId;

  @Prop({ default: 0 })
  attendeeCount: number;

  @Prop({ default: 0 })
  ticketSold: number;

  @Prop({ default: 0 })
  scannedTicket: number;
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);

AnalyticsSchema.virtual('id').get(function () {
  return this._id;
});
