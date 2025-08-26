import { IsString, IsNotEmpty, IsOptional, IsHexColor } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsString()
  @IsHexColor()
  @IsNotEmpty()
  public color: string;

  @IsString()
  @IsNotEmpty()
  public icon: string;
}
