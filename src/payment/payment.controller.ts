import { Controller, Post, Get, Param, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // Create SSLCommerz Session
  @Post('create-session/:orderId')
  async createSession(@Param('orderId') orderId: number) {
    return await this.paymentService.createSession(orderId);
  }

  // Payment Success
  @Post('success')
  async success(@Body() body: any, @Res() res: Response) {
    await this.paymentService.paymentSuccess(body);
    return res.redirect('http://localhost:4000/payment/success');
  }

  // Payment Failed
  @Post('fail')
  async fail(@Body() body: any, @Res() res: Response) {
    await this.paymentService.paymentFail(body);
    return res.redirect('http://localhost:4000/payment/fail');
  }

  // Payment Cancelled
  @Post('cancel')
  async cancel(@Body() body: any, @Res() res: Response) {
    await this.paymentService.paymentCancel(body);
    return res.redirect('http://localhost:4000/payment/cancel');
  }

  // IPN (Instant Payment Notification)
  @Post('ipn')
  async ipn(@Body() body: any) {
    return await this.paymentService.ipn(body);
  }

  // Status polling
  @Get('status/:orderId')
  async getStatus(@Param('orderId') orderId: number) {
    return await this.paymentService.getStatus(orderId);
  }
}
