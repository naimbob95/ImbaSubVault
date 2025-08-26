import { Controller, Get, Put, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  public async getProfile(@Request() req): Promise<UserResponseDto> {
    return this.usersService.getProfile(req.user.userId);
  }

  @Put('profile')
  public async updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateProfile(req.user.userId, updateUserDto);
  }

  @Delete('account')
  public async deleteAccount(@Request() req): Promise<{ message: string }> {
    await this.usersService.deleteAccount(req.user.userId);
    return { message: 'Account deleted successfully' };
  }
}
