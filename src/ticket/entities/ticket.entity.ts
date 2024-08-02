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
export class Ticket extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  event: Types.ObjectId;

  @Prop({ type: String, required: true })
  qrCode: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: String, required: false })
  isScanned: boolean;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

TicketSchema.virtual('id').get(function (this: Ticket) {
  return this._id;
});
