import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Order } from '../customer/order.entity';

@Injectable()
export class PaymentService {
  private readonly store_id = process.env.SSLCZ_STORE_ID;
  private readonly store_passwd = process.env.SSLCZ_STORE_PASS;
  private readonly base_url = 'https://sandbox.sslcommerz.com';

  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  // 1. Create a payment session for an existing order
  async createSession(orderId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['customer'],
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.paymentStatus === 'paid') {
      throw new BadRequestException('Order is already paid');
    }

    const tran_id = `TXN_${order.id}_${Date.now()}`;

    const payload = {
      store_id: this.store_id,
      store_passwd: this.store_passwd,
      total_amount: order.totalAmount,
      currency: 'BDT',
      tran_id,
      success_url: `${process.env.BACKEND_URL}/payment/success`,
      fail_url: `${process.env.BACKEND_URL}/payment/fail`,
      cancel_url: `${process.env.BACKEND_URL}/payment/cancel`,
      ipn_url: `${process.env.BACKEND_URL}/payment/ipn`,
      shipping_method: 'NO',
      product_name: `Order-${order.id}`,
      product_category: 'General',
      product_profile: 'general',
      cus_name: order.customer?.name || 'Customer',
      cus_email: order.customer?.email || 'customer@example.com',
      cus_add1: 'N/A',
      cus_city: 'Dhaka',
      cus_country: 'Bangladesh',
      cus_phone: '01700000000', // no phone field on customerEntity — placeholder for sandbox
    };

    const response = await axios.post(
      `${this.base_url}/gwprocess/v4/api.php`,
      new URLSearchParams(payload as any).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    if (response.data.status !== 'SUCCESS') {
      throw new BadRequestException('Failed to initiate SSLCommerz session');
    }

    order.tranId = tran_id;
    await this.orderRepo.save(order);

    return { url: response.data.GatewayPageURL };
  }

  // 2. Validate a transaction against SSLCommerz
  private async validateTransaction(val_id: string) {
    const response = await axios.get(
      `${this.base_url}/validator/api/validationserverAPI.php`,
      {
        params: {
          val_id,
          store_id: this.store_id,
          store_passwd: this.store_passwd,
          format: 'json',
        },
      },
    );
    return response.data;
  }

  // 3. Success callback
  async paymentSuccess(body: any) {
    const validation = await this.validateTransaction(body.val_id);

    if (validation.status !== 'VALID' && validation.status !== 'VALIDATED') {
      throw new BadRequestException('Transaction validation failed');
    }

    const order = await this.orderRepo.findOne({
      where: { tranId: validation.tran_id },
    });
    if (!order)
      throw new NotFoundException('Order not found for this transaction');

    // Amount tampering check — reject if the paid amount doesn't match the order
    if (Number(validation.amount) !== Number(order.totalAmount)) {
      order.paymentStatus = 'failed';
      await this.orderRepo.save(order);
      throw new BadRequestException('Amount mismatch — possible tampering');
    }

    order.paymentStatus = 'paid';
    order.paidAt = new Date();
    if (order.status === 'pending') order.status = 'accepted';

    await this.orderRepo.save(order);
    return { success: true };
  }

  // 4. Fail callback
  async paymentFail(body: any) {
    const order = await this.orderRepo.findOne({
      where: { tranId: body.tran_id },
    });
    if (order) {
      order.paymentStatus = 'failed';
      await this.orderRepo.save(order);
    }
    return { success: false };
  }

  // 5. Cancel callback
  async paymentCancel(body: any) {
    const order = await this.orderRepo.findOne({
      where: { tranId: body.tran_id },
    });
    if (order) {
      order.paymentStatus = 'cancelled';
      await this.orderRepo.save(order);
    }
    return { success: false };
  }

  // 6. IPN — the reliable async fallback
  async ipn(body: any) {
    if (!body.val_id) return { success: false };

    const validation = await this.validateTransaction(body.val_id);
    if (validation.status === 'VALID' || validation.status === 'VALIDATED') {
      const order = await this.orderRepo.findOne({
        where: { tranId: validation.tran_id },
      });
      if (order && order.paymentStatus !== 'paid') {
        // Amount tampering check here too
        if (Number(validation.amount) !== Number(order.totalAmount)) {
          order.paymentStatus = 'failed';
          await this.orderRepo.save(order);
          return { success: false };
        }
        order.paymentStatus = 'paid';
        order.paidAt = new Date();
        await this.orderRepo.save(order);
      }
    }
    return { success: true };
  }

  // 7. Status polling — for frontend to check after redirect
  async getStatus(orderId: number) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    return { paymentStatus: order.paymentStatus, orderStatus: order.status };
  }
}
