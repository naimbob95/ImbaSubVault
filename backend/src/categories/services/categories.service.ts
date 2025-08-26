import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories.repository';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  public async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoriesRepository.findByName(createCategoryDto.name);
    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }
    return this.categoriesRepository.create(createCategoryDto);
  }

  public async findAll(): Promise<Category[]> {
    return this.categoriesRepository.findAll();
  }

  public async findById(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  public async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    if ('name' in updateCategoryDto && updateCategoryDto.name) {
      const existingCategory = await this.categoriesRepository.findByName(updateCategoryDto.name);
      if (existingCategory && (existingCategory as any)._id.toString() !== id) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    const updatedCategory = await this.categoriesRepository.update(id, updateCategoryDto);
    if (!updatedCategory) {
      throw new NotFoundException('Category not found');
    }
    return updatedCategory;
  }

  public async remove(id: string): Promise<void> {
    const deletedCategory = await this.categoriesRepository.delete(id);
    if (!deletedCategory) {
      throw new NotFoundException('Category not found');
    }
  }

  public async seedCategories(): Promise<void> {
    const defaultCategories = [
      {
        name: 'Entertainment',
        description: 'Streaming services, music, games, and entertainment subscriptions',
        color: '#FF6B6B',
        icon: 'entertainment',
      },
      {
        name: 'Software',
        description: 'Development tools, productivity software, and SaaS applications',
        color: '#4ECDC4',
        icon: 'software',
      },
      {
        name: 'Utilities',
        description: 'Cloud storage, hosting, and utility services',
        color: '#45B7D1',
        icon: 'utilities',
      },
      {
        name: 'News & Media',
        description: 'News subscriptions, magazines, and media services',
        color: '#96CEB4',
        icon: 'news',
      },
      {
        name: 'Health & Fitness',
        description: 'Fitness apps, health monitoring, and wellness services',
        color: '#FFEAA7',
        icon: 'health',
      },
      {
        name: 'Education',
        description: 'Online courses, learning platforms, and educational content',
        color: '#DDA0DD',
        icon: 'education',
      },
      {
        name: 'Business',
        description: 'Business tools, CRM, and professional services',
        color: '#F39C12',
        icon: 'business',
      },
      {
        name: 'Other',
        description: 'Other miscellaneous subscriptions',
        color: '#95A5A6',
        icon: 'other',
      },
    ];

    for (const categoryData of defaultCategories) {
      const existingCategory = await this.categoriesRepository.findByName(categoryData.name);
      if (!existingCategory) {
        await this.categoriesRepository.create(categoryData);
      }
    }
  }
}
