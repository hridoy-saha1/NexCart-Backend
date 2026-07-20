import { Controller, Post, Get, Param, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-session/:orderId')
  async createSession(@Param('orderId') orderId: number) {
    return await this.paymentService.createSession(orderId);
  }

  @Post('success')
  async success(@Body() body: any, @Res() res: Response) {
    await this.paymentService.paymentSuccess(body);
    return res.redirect('https://nexcart-bd.vercel.app/payment/success');
  }

  @Post('fail')
  async fail(@Body() body: any, @Res() res: Response) {
    await this.paymentService.paymentFail(body);
    return res.redirect('https://nexcart-bd.vercel.app/payment/fail');
  }

  @Post('cancel')
  async cancel(@Body() body: any, @Res() res: Response) {
    await this.paymentService.paymentCancel(body);
    return res.redirect('https://nexcart-bd.vercel.app/payment/cancel');
  }

  @Post('ipn')
  async ipn(@Body() body: any) {
    return await this.paymentService.ipn(body);
  }

  @Get('status/:orderId')
  async getStatus(@Param('orderId') orderId: number) {
    return await this.paymentService.getStatus(orderId);
  }
}
