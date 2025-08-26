import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories/services/categories.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', // Next.js development
      'http://localhost:3001', // Alternative port
      'https://your-production-domain.com' // Add your production domain
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies for JWT
  });

  // Global API prefix
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Auto-seed categories on startup
  const categoriesService = app.get(CategoriesService);
  await categoriesService.seedCategories();

  await app.listen(process.env.PORT ?? 5001);
}
void bootstrap();
