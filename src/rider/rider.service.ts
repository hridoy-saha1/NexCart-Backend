import * as bcrypt from 'bcrypt';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rider, RiderStatus } from './rider.entity';
import { Review } from './review.entity';
import { Delivery, DeliveryStatus } from './delivery.entity';
import { Order } from 'src/customer/order.entity';

import { CreateRiderDto, ChangePasswordDto, riderLoginDto } from './rider.dto';
import { CreateReviewDto } from './review.dto';

import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { PusherService } from 'src/pusher/pusher.service';

@Injectable()
export class RiderService {
  constructor(
    @InjectRepository(Rider)
    private riderRepository: Repository<Rider>,

    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,

    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    private readonly mailerService: MailerService,
    private readonly pusherService: PusherService,
    private readonly jwtService: JwtService,
  ) {}

  // ==============================
  // REGISTER RIDER (WITH IMAGE)
  // ==============================
  async createRider(
    dto: CreateRiderDto,
    profileImage?: Express.Multer.File,
  ): Promise<Rider> {
    try {
      const existingRider = await this.riderRepository.findOne({
        where: [{ email: dto.email }, { phone: dto.phone }],
      });

      if (existingRider) {
        if (existingRider.email === dto.email) {
          throw new BadRequestException('Email already exists');
        }
        if (existingRider.phone === dto.phone) {
          throw new BadRequestException('Phone already exists');
        }
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const rider = this.riderRepository.create({
        ...dto,
        password: hashedPassword,
        status: dto.status || RiderStatus.OFFLINE,
        profileImage: profileImage ? profileImage.filename : null,
      });

      const savedRider = await this.riderRepository.save(rider);

      return savedRider;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException('Failed to create rider');
    }
  }

  // ==============================
  // LOGIN
  // ==============================
  async login(dto: riderLoginDto): Promise<object> {
    const rider = await this.riderRepository.findOne({
      where: { email: dto.email },
    });

    if (!rider) {
      throw new BadRequestException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, rider.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload = {
      email: rider.email,
      sub: rider.id,
      role: 'rider',
    };

    const token = this.jwtService.sign(payload);

    const { password, ...result } = rider;

    return {
      message: 'Login successful',
      rider: result,
      access_token: token,
    };
  }

  // ==============================
  // CHANGE STATUS
  // ==============================
  async changeStatus(id: number, status: RiderStatus): Promise<Rider> {
    const rider = await this.riderRepository.findOne({ where: { id } });

    if (!rider) {
      throw new NotFoundException(`Rider not found with id: ${id}`);
    }

    rider.status = status;

    return await this.riderRepository.save(rider);
  }

  // ==============================
  // GET AVAILABLE RIDERS
  // ==============================
  async getAvailable(): Promise<Rider[]> {
    return await this.riderRepository.find({
      where: { status: RiderStatus.AVAILABLE },
    });
  }

  // ==============================
  // GET ALL RIDERS
  // ==============================
  async getAllRiders(): Promise<Rider[]> {
    return await this.riderRepository.find({
      relations: ['reviews', 'orders', 'admins'],
    });
  }

  // ==============================
  // GET SINGLE RIDER
  // ==============================
  async getRider(id: number): Promise<Rider> {
    const rider = await this.riderRepository.findOne({
      where: { id },
      relations: ['reviews', 'orders'],
    });

    if (!rider) {
      throw new NotFoundException(`Rider not found with id: ${id}`);
    }

    return rider;
  }

  // ==============================
  // UPDATE RIDER (WITH IMAGE)
  // ==============================
  async updateRider(
    id: number,
    dto: Partial<CreateRiderDto>,
    profileImage?: Express.Multer.File,
  ): Promise<Rider> {
    const rider = await this.riderRepository.findOne({
      where: { id },
    });

    if (!rider) {
      throw new NotFoundException(`Rider not found with id: ${id}`);
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    if (profileImage) {
      rider.profileImage = profileImage.filename;
    }

    Object.assign(rider, dto);

    return await this.riderRepository.save(rider);
  }

  // ==============================
  // CHANGE RIDER PASSWORD
  // ==============================
  async changePassword(id: number, dto: ChangePasswordDto): Promise<object> {
    const rider = await this.riderRepository.findOne({ where: { id } });

    if (!rider) {
      throw new NotFoundException(`Rider not found with id: ${id}`);
    }

    const isMatch = await bcrypt.compare(dto.currentPassword, rider.password);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    rider.password = await bcrypt.hash(dto.newPassword, 10);
    await this.riderRepository.save(rider);

    return {
      message: 'Password changed successfully',
    };
  }

  // ==============================
  // DELETE RIDER
  // ==============================
  async deleteRider(id: number): Promise<object> {
    const rider = await this.riderRepository.findOne({
      where: { id },
    });

    if (!rider) {
      throw new NotFoundException(`Rider not found with id: ${id}`);
    }

    await this.riderRepository.remove(rider);

    return {
      message: 'Rider deleted successfully',
    };
  }

  // ==============================
  // ADD REVIEW
  // ==============================
  async addReview(id: number, dto: CreateReviewDto): Promise<Review> {
    const rider = await this.riderRepository.findOne({
      where: { id },
    });

    if (!rider) {
      throw new NotFoundException(`Rider not found with id: ${id}`);
    }

    const review = this.reviewRepository.create({
      ...dto,
      rider,
    });

    return await this.reviewRepository.save(review);
  }

  // ==============================
  // GET REVIEWS
  // ==============================
  async getReviews(id: number): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { rider: { id } },
      relations: ['rider'],
      order: { created_at: 'DESC' },
    });
  }

  // ==============================
  // UPDATE ORDER STATUS
  // ==============================
  async updateOrderStatus(
    orderId: number,
    status: 'processing' | 'delivered',
    riderId: number,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['rider'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!['processing', 'delivered'].includes(status)) {
      throw new BadRequestException('Invalid order status');
    }

    if (order.status === 'delivered') {
      throw new BadRequestException('Order already delivered');
    }

    const rider = await this.riderRepository.findOne({
      where: { id: riderId },
    });

    if (!rider) {
      throw new NotFoundException(`Rider not found with id: ${riderId}`);
    }

    order.status = status;

    const updatedOrder = await this.orderRepository.save(order);
    await this.pusherService.trigger(
      'order-channel',

      'order-status-updated',

      {
        orderId: order.id,

        status: updatedOrder.status,
      },
    );

    if (status === 'delivered') {
      const existingDelivery = await this.deliveryRepository.findOne({
        where: { order: { id: orderId } },
      });

      if (!existingDelivery) {
        const delivery = this.deliveryRepository.create({
          order,
          rider,
        });

        await this.deliveryRepository.save(delivery);
      }
    }

    return updatedOrder;
  }

  // ==============================
  // GET RIDER'S ORDERS
  // ==============================
  async getAcceptedOrders(riderId: number) {
    return await this.deliveryRepository.find({
      where: {
        rider: { id: riderId },
        status: DeliveryStatus.ACCEPTED,
      },
      relations: ['order', 'order.customer', 'order.orderItems'],
    });
  }
  async updateDeliveryStatus(deliveryId: number, status: DeliveryStatus) {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryId },
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    if (!Object.values(DeliveryStatus).includes(status)) {
      throw new BadRequestException('Invalid delivery status');
    }

    delivery.status = status;

    return await this.deliveryRepository.save(delivery);
  }

  async getRiderDeliveries(riderId: number) {
    return await this.deliveryRepository.find({
      where: {
        rider: {
          id: riderId,
        },
      },

      relations: ['order', 'rider'],
    });
  }

async markOrderDelivered(deliveryId: number) {
  const delivery = await this.deliveryRepository.findOne({
    where: { id: deliveryId },
    relations: ['order'],
  });

  if (!delivery) {
    throw new NotFoundException('Delivery not found');
  }

  // update order status
  delivery.order.status = 'delivered';

  await this.orderRepository.save(delivery.order);

  // optional but recommended: update delivery too
  delivery.status = DeliveryStatus.ACCEPTED; // or you can add DELIVERED enum
  await this.deliveryRepository.save(delivery);

  return {
    message: 'Order marked as delivered',
  };
}

}
