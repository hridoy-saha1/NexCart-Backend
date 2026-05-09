import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SellerEntity } from '../entities/seller.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendSellerRegistrationEmail(seller: SellerEntity): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: seller.email,
        subject: 'Seller Registration Successful',
        html: `
        <h2>Welcome ${seller.name}</h2>
        <p>Your seller account has been created successfully.</p>
        <p><b>Email:</b> ${seller.email}</p>
      `,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}