import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const dataSource = app.get(DataSource);

  // // wait for connection if not ready
  // if (!dataSource.isInitialized) {
  //   await dataSource.initialize();
  // }

  // // ensure columns exist
  // await dataSource.query(`
  //   ALTER TABLE "admin"
  //   ADD COLUMN IF NOT EXISTS "otp" varchar(6) NULL,
  //   ADD COLUMN IF NOT EXISTS "otpExpiry" timestamp NULL,
  //   ADD COLUMN IF NOT EXISTS "isVerified" boolean NOT NULL DEFAULT false;
  // `);

  // // auto-verify known admin emails on every startup
  // await dataSource.query(`
  //   UPDATE "admin"
  //   SET "isVerified" = true
  //   WHERE email IN ('nurhasin910@gmail.com', 'neymar910jr@gmail.com');
  // `);

  // console.log('Admin columns ensured and verified');

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:4000', // Allow only your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies/headers if needed
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();