import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CategoriesRepository } from '../repositories/categories.repository';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: CategoriesRepository;

  const mockCategory = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Entertainment',
    description: 'Streaming services and entertainment',
    color: '#FF6B6B',
    icon: 'entertainment',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCategoriesRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByName: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoriesRepository,
          useValue: mockCategoriesRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<CategoriesRepository>(CategoriesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createCategoryDto: CreateCategoryDto = {
      name: 'Entertainment',
      description: 'Streaming services and entertainment',
      color: '#FF6B6B',
      icon: 'entertainment',
    };

    it('should create a category successfully', async () => {
      mockCategoriesRepository.findByName.mockResolvedValue(null);
      mockCategoriesRepository.create.mockResolvedValue(mockCategory);

      const result = await service.create(createCategoryDto);

      expect(mockCategoriesRepository.findByName).toHaveBeenCalledWith(createCategoryDto.name);
      expect(mockCategoriesRepository.create).toHaveBeenCalledWith(createCategoryDto);
      expect(result).toEqual(mockCategory);
    });

    it('should throw ConflictException if category with same name exists', async () => {
      mockCategoriesRepository.findByName.mockResolvedValue(mockCategory);

      await expect(service.create(createCategoryDto)).rejects.toThrow(ConflictException);
      expect(mockCategoriesRepository.findByName).toHaveBeenCalledWith(createCategoryDto.name);
      expect(mockCategoriesRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const categories = [mockCategory];
      mockCategoriesRepository.findAll.mockResolvedValue(categories);

      const result = await service.findAll();

      expect(mockCategoriesRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(categories);
    });
  });

  describe('findById', () => {
    it('should return a category by id', async () => {
      mockCategoriesRepository.findById.mockResolvedValue(mockCategory);

      const result = await service.findById('507f1f77bcf86cd799439011');

      expect(mockCategoriesRepository.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException if category not found', async () => {
      mockCategoriesRepository.findById.mockResolvedValue(null);

      await expect(service.findById('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
      expect(mockCategoriesRepository.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });

  describe('update', () => {
    const updateCategoryDto: UpdateCategoryDto = {
      name: 'Updated Entertainment',
      description: 'Updated description',
    };

    it('should update a category successfully', async () => {
      const updatedCategory = { ...mockCategory, ...updateCategoryDto };
      mockCategoriesRepository.findByName.mockResolvedValue(null);
      mockCategoriesRepository.update.mockResolvedValue(updatedCategory);

      const result = await service.update('507f1f77bcf86cd799439011', updateCategoryDto);

      expect(mockCategoriesRepository.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateCategoryDto,
      );
      expect(result).toEqual(updatedCategory);
    });

    it('should throw NotFoundException if category not found', async () => {
      mockCategoriesRepository.findByName.mockResolvedValue(null);
      mockCategoriesRepository.update.mockResolvedValue(null);

      await expect(service.update('507f1f77bcf86cd799439011', updateCategoryDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if updating name to existing name', async () => {
      const existingCategory = { ...mockCategory, _id: '507f1f77bcf86cd799439012' };
      mockCategoriesRepository.findByName.mockResolvedValue(existingCategory);

      await expect(service.update('507f1f77bcf86cd799439011', updateCategoryDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a category successfully', async () => {
      mockCategoriesRepository.delete.mockResolvedValue(mockCategory);

      await service.remove('507f1f77bcf86cd799439011');

      expect(mockCategoriesRepository.delete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException if category not found', async () => {
      mockCategoriesRepository.delete.mockResolvedValue(null);

      await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });
  });

  describe('seedCategories', () => {
    it('should seed default categories', async () => {
      mockCategoriesRepository.findByName.mockResolvedValue(null);
      mockCategoriesRepository.create.mockResolvedValue(mockCategory);

      await service.seedCategories();

      expect(mockCategoriesRepository.findByName).toHaveBeenCalledTimes(8);
      expect(mockCategoriesRepository.create).toHaveBeenCalledTimes(8);
    });

    it('should not create categories that already exist', async () => {
      mockCategoriesRepository.findByName.mockResolvedValue(mockCategory);

      await service.seedCategories();

      expect(mockCategoriesRepository.findByName).toHaveBeenCalledTimes(8);
      expect(mockCategoriesRepository.create).not.toHaveBeenCalled();
    });
  });
});
