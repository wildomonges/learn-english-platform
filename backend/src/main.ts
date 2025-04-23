import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Enable CORS
  app.enableCors();

  // Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Learn English API')
    .setDescription('The Learn English API description')
    .setVersion('1.0')
    .addBearerAuth()
   .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);
  
  // Start Server
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log('Server started on port ' + port);
}
bootstrap();
