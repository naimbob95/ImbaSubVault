import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
  IsBoolean,
  IsUrl,
  IsMongoId,
} from 'class-validator';

export class CreateSubscriptionDto {
  @IsMongoId()
  @IsNotEmpty()
  public categoryId: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsNumber()
  @IsNotEmpty()
  public cost: number;

  @IsString()
  @IsOptional()
  public currency?: string;

  @IsEnum(['monthly', 'yearly', 'weekly', 'daily'])
  @IsNotEmpty()
  public billingCycle: string;

  @IsDateString()
  @IsNotEmpty()
  public startDate: string;

  @IsBoolean()
  @IsOptional()
  public isActive?: boolean;

  @IsString()
  @IsOptional()
  @IsUrl()
  public website?: string;

  @IsString()
  @IsOptional()
  public notes?: string;
}
