import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/uploads', express.static('uploads'));
//   const dataSource = app.get(DataSource);
//   await dataSource.query(`
//   DELETE FROM "admin" WHERE email = 'nurhasin910@gmail.com';
// `);
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:4000', // Allow only your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies/headers if needed
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
