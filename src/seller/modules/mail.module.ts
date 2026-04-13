// import { Module } from '@nestjs/common';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { MailService } from './mail.service';

// @Module({
//   imports: [
//     MailerModule.forRoot({
//       transport: {
//         host: 'smtp.gmail.com',
//         port: 465,
//         secure: true,
//         auth: {
//           user: process.env.MAIL_USER,
//           pass: process.env.MAIL_PASS,
//         },
//       },
//       defaults: {
//         from: `"NexCart" <${process.env.MAIL_USER}>`,
//       },
//     }),
//   ],
//   providers: [MailService],
//   exports: [MailService],
// })
// export class MailModule {}



import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule], // ensures ConfigModule is available here
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: config.get<string>('MAIL_USER'), //  loaded safely at runtime
            pass: config.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"NexCart" <${config.get<string>('MAIL_USER')}>`,
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}