import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig, swaggerCustomOptions } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Swagger configuration
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  
  // Main Swagger UI
  SwaggerModule.setup('api/docs', app, document, swaggerCustomOptions);
  
  // JSON export endpoint
  SwaggerModule.setup('api/docs-json', app, document, {
    ...swaggerCustomOptions,
    jsonDocumentUrl: undefined, // Disable nested JSON endpoint
  });
  
  // YAML export endpoint
  SwaggerModule.setup('api/docs-yaml', app, document, {
    ...swaggerCustomOptions,
    yamlDocumentUrl: undefined, // Disable nested YAML endpoint
  });

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/api/docs`);
  console.log(`Swagger JSON export: http://localhost:${port}/api/docs-json`);
  console.log(`Swagger YAML export: http://localhost:${port}/api/docs-yaml`);
}
bootstrap();
