import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000), '0.0.0.0';

  process.on('SIGTERM', async () => {
    console.log('Apagando la aplicación...');
    await app.close();
  });
}
bootstrap();
