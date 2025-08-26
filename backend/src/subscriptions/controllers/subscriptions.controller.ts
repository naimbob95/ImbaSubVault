import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { SubscriptionsService } from '../services/subscriptions.service';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { UpdateSubscriptionDto } from '../dto/update-subscription.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  public async create(@Request() req, @Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(req.user.userId, createSubscriptionDto);
  }

  @Get()
  public async findAll(@Request() req, @Query('category') categoryId?: string) {
    if (categoryId) {
      return this.subscriptionsService.findByCategory(categoryId);
    }
    return this.subscriptionsService.findAllByUser(req.user.userId);
  }

  @Get(':id')
  public async findOne(@Param('id') id: string, @Request() req) {
    return this.subscriptionsService.findById(id, req.user.userId);
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(id, req.user.userId, updateSubscriptionDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string, @Request() req) {
    await this.subscriptionsService.remove(id, req.user.userId);
    return { message: 'Subscription deleted successfully' };
  }

  @Get('active/list')
  public async findActive(@Request() req) {
    return this.subscriptionsService.findActiveByUser(req.user.userId);
  }

  @Get('upcoming/:days')
  public async findUpcomingPayments(@Param('days') days: string, @Request() req) {
    return this.subscriptionsService.findUpcomingPayments(req.user.userId, parseInt(days));
  }
}
