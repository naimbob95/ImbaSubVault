import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subscription, SubscriptionDocument } from '../schemas/subscription.schema';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { UpdateSubscriptionDto } from '../dto/update-subscription.dto';

@Injectable()
export class SubscriptionsRepository {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
  ) {}

  async create(
    userId: string,
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const createdSubscription = new this.subscriptionModel({
      ...createSubscriptionDto,
      userId: new Types.ObjectId(userId),
      categoryId: new Types.ObjectId(createSubscriptionDto.categoryId),
    });
    return createdSubscription.save();
  }

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionModel.find().populate('categoryId').exec();
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    return this.subscriptionModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('categoryId')
      .exec();
  }

  async findById(id: string): Promise<Subscription | null> {
    return this.subscriptionModel.findById(id).populate('categoryId').exec();
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Subscription | null> {
    return this.subscriptionModel
      .findOne({ _id: id, userId: new Types.ObjectId(userId) })
      .populate('categoryId')
      .exec();
  }

  async update(
    id: string,
    userId: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription | null> {
    const updateData: any = { ...updateSubscriptionDto };
    if (updateSubscriptionDto.categoryId) {
      updateData.categoryId = new Types.ObjectId(updateSubscriptionDto.categoryId);
    }

    return this.subscriptionModel
      .findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, updateData, { new: true })
      .populate('categoryId')
      .exec();
  }

  async delete(id: string, userId: string): Promise<Subscription | null> {
    return this.subscriptionModel
      .findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) })
      .exec();
  }

  async findByCategory(categoryId: string): Promise<Subscription[]> {
    return this.subscriptionModel
      .find({ categoryId: new Types.ObjectId(categoryId) })
      .populate('categoryId')
      .exec();
  }

  async findActiveByUserId(userId: string): Promise<Subscription[]> {
    return this.subscriptionModel
      .find({ userId: new Types.ObjectId(userId), isActive: true })
      .populate('categoryId')
      .exec();
  }

  async findUpcomingPayments(userId: string, days: number): Promise<Subscription[]> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + days);

    return this.subscriptionModel
      .find({
        userId: new Types.ObjectId(userId),
        isActive: true,
        nextPaymentDate: { $gte: startDate, $lte: endDate },
      })
      .populate('categoryId')
      .exec();
  }
}
