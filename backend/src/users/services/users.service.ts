import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from '../repositories/users.repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { User } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.mapToResponseDto(user);
  }

  public async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if email is being updated and if it's already taken
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }

    // Hash password if provided
    const updateData = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.usersRepository.updateById(userId, updateData);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return this.mapToResponseDto(updatedUser);
  }

  public async deleteAccount(userId: string): Promise<void> {
    const user = await this.usersRepository.deleteById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: (user as any)._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: (user as any).createdAt,
      updatedAt: (user as any).updatedAt,
    };
  }
}
