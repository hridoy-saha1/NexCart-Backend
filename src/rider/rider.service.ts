import * as bcrypt from 'bcrypt';


import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rider } from './rider.entity';


import { Review } from './review.entity';
import { Delivery } from './delivery.entity';
import { Order } from 'src/customer/order.entity';
import { riderLoginDto } from './rider.dto';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';




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
  private readonly jwtService: JwtService,

  ) {}

  async createRider(dto: any): Promise<Rider> {

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return await this.riderRepository.save({
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
    });
  }

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


    const payload = { email: rider.email, sub: rider.id };
    const token = this.jwtService.sign(payload);


    const { password, ...result } = rider;

    return {
message: 'Login successful',
rider: result,
access_token :token
    }

  }

  async changeStatus(
    id: number,
    status: 'available' | 'busy' | 'offline',
  ): Promise<Rider> {

    const rider = await this.riderRepository.findOne({ where: { id } });

    if (!rider) {
      throw new BadRequestException(`Not Found Your id: ${id}`);
    }

    rider.status = status;
    return await this.riderRepository.save(rider);
  }

  async getAvailable(): Promise<Rider[]> {
    return await this.riderRepository.find({
      where: { status: 'available' },
    });
  }

  async getAllRiders(): Promise<Rider[]> {
    return await this.riderRepository.find();
  }

  async getRider(id: number): Promise<Rider> {
    const rider = await this.riderRepository.findOne({ where: { id } });

    if (!rider) {
      throw new BadRequestException(`Not Found Your id: ${id}`);
    }

    return rider;
  }

  async updateRider(id: number, dto: any): Promise<Rider> {
    const rider = await this.riderRepository.findOne({ where: { id } });

    if (!rider) {
      throw new BadRequestException(`Not Found Your id: ${id}`);
    }

    Object.assign(rider, dto);
    return await this.riderRepository.save(rider);
  }

  async deleteRider(id: number): Promise<Rider> {
    const rider = await this.riderRepository.findOne({ where: { id } });

    if (!rider) {
      throw new BadRequestException(`Not Found Your id: ${id}`);
    }

    return await this.riderRepository.remove(rider);
  }

  // 
async addReview(id: number, dto: any): Promise<Review[]> {

  const rider = await this.riderRepository.findOne({ where: { id } });

  if (!rider) {
    throw new BadRequestException(`Rider not found with id: ${id}`);
  }

  const review = this.reviewRepository.create({
    ...dto,
    rider,
  });

  return await this.reviewRepository.save(review);

}

// 📄 Get Reviews
async getReviews(id: number): Promise<Review[]> {

  return await this.reviewRepository.find({
    where: { rider: { id } },
    relations: ['rider'],
  });
}

async updateOrderStatus(
  orderId: number,
  status: 'processing' | 'delivered',
  riderId: number,
): Promise<Order> {
  const order = await this.orderRepository.findOne({
    where: { id: orderId },
  });

  if (!order) {
    throw new NotFoundException('Order not found');
  }

  if (!['processing', 'delivered'].includes(status)) {
    throw new BadRequestException('Invalid status');
  }

  // ❌ Prevent re-delivery
  if (order.status === 'delivered') {
    throw new BadRequestException('Order already delivered');
  }

  order.status = status;

  // ✅ When delivered → insert into delivery table
  if (status === 'delivered') {
    const rider = await this.riderRepository.findOne({
      where: { id: riderId },
    });

    if (!rider) {
      throw new NotFoundException('Rider not found');
    }

    // ❌ Prevent duplicate delivery record
    const existing = await this.deliveryRepository.findOne({
      where: { order: { id: orderId } },
    });

    if (existing) {
      throw new BadRequestException(
        'Delivery already recorded',
      );
    }

    const delivery = this.deliveryRepository.create({
      order: order,
      rider: rider,
    });

    await this.deliveryRepository.save(delivery);
  }

  return await this.orderRepository.save(order);
}
}