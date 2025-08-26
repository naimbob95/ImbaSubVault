import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionsService } from './services/subscriptions.service';
import { SubscriptionsController } from './controllers/subscriptions.controller';
import { SubscriptionsRepository } from './repositories/subscriptions.repository';
import { Subscription, SubscriptionSchema } from './schemas/subscription.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Subscription.name, schema: SubscriptionSchema }])],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, SubscriptionsRepository],
  exports: [SubscriptionsService, SubscriptionsRepository],
})
export class SubscriptionsModule {}
