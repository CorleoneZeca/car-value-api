import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Do not alowed other fields in the incomming request. Only the dto explicits.
    }),
  );
  await app.listen(3000);
}
bootstrap();
