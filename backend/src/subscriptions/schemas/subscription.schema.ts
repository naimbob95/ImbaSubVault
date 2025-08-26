import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  cost: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({
    required: true,
    enum: ['monthly', 'yearly', 'weekly', 'daily'],
  })
  billingCycle: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  website: string;

  @Prop()
  notes: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
