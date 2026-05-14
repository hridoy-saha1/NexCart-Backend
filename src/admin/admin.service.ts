import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { AdminEntity } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Order } from 'src/customer/order.entity';
import { Rider } from 'src/rider/rider.entity';
import * as bcrypt from 'bcrypt';
import { PusherService } from 'src/pusher/pusher.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,

    @InjectRepository(Rider)
    private readonly riderRepo: Repository<Rider>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly pusherService: PusherService,
  ) {}

  // CREATE
  async create(dto: CreateAdminDto): Promise<AdminEntity> {
    const admin = this.adminRepo.create(dto);
    return this.adminRepo.save(admin);
  }

  // GET ALL
  async findAll(): Promise<AdminEntity[]> {
    return await this.adminRepo.find();
  }

  // SEARCH
  async search(name: string): Promise<AdminEntity[]> {
    return await this.adminRepo.find({
      where: { name: Like(`%${name}%`) },
    });
  }

  // GET ONE
  async findOne(id: number): Promise<AdminEntity> {
    const admin = await this.adminRepo.findOne({ where: { id } });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }

  // PUT (Full update)
  async update(id: number, dto: CreateAdminDto): Promise<AdminEntity> {
    const admin = await this.findOne(id);

    admin.name = dto.name;
    admin.email = dto.email;
    admin.password = dto.password;
    admin.isActive = dto.isActive ?? admin.isActive;

    return this.adminRepo.save(admin);
  }

  // PATCH (Partial update)
  async partialUpdate(id: number, dto: UpdateAdminDto): Promise<AdminEntity> {
    const admin = await this.findOne(id);

    if (dto.name !== undefined) admin.name = dto.name;
    if (dto.email !== undefined) admin.email = dto.email;
    if (dto.password !== undefined) admin.password = dto.password;
    if (dto.isActive !== undefined) admin.isActive = dto.isActive;

    return await this.adminRepo.save(admin);
  }

  // DELETE
  async remove(id: number): Promise<void> {
    const admin: AdminEntity = await this.findOne(id);
    await this.adminRepo.remove(admin);
  }

  // Assign Rider to Admin
  async assignRider(adminId: number, riderId: number): Promise<AdminEntity> {
    const admin = await this.adminRepo.findOne({
      where: { id: adminId },
      relations: ['riders'],
    });

    if (!admin) throw new NotFoundException('Admin not found');

    const rider = await this.riderRepo.findOneBy({ id: riderId });
    if (!rider) throw new NotFoundException('Rider not found');

    if (admin.riders.some((r) => r.id === rider.id)) {
      throw new BadRequestException('Rider already assigned');
    }

    admin.riders.push(rider);
    return this.adminRepo.save(admin);
  }

  // Assign Rider to Order
  async assignRiderToOrder(orderId: number, riderId: number): Promise<Order> {
    const order = await this.orderRepo.findOneBy({ id: orderId });
    if (!order) throw new NotFoundException('Order not found');

    const rider = await this.riderRepo.findOneBy({ id: riderId });
    if (!rider) throw new NotFoundException('Rider not found');

    if (order.rider) {
      throw new BadRequestException('Rider already assigned to this order');
    }

    order.rider = rider;

    order.status = 'rider_assigned';

    const updatedOrder = await this.orderRepo.save(order);

    await this.pusherService.trigger(
      'order-channel',

      'order-status-updated',

      {
        orderId: order.id,

        status: updatedOrder.status,
      },
    );

    return updatedOrder;
  }

  // Get Admin with Assigned Riders
  async getAdminWithRiders(id: number): Promise<AdminEntity> {
    const admin = await this.adminRepo.findOne({
      where: { id },
      relations: ['riders'],
    });

    if (!admin) throw new NotFoundException('Admin not found');

    return admin;
  }

  // Remove Rider from Admin
  async removeRider(adminId: number, riderId: number): Promise<AdminEntity> {
    const admin = await this.adminRepo.findOne({
      where: { id: adminId },
      relations: ['riders'],
    });

    if (!admin) throw new NotFoundException('Admin not found');

    const rider = admin.riders.find((r) => r.id === riderId);
    if (!rider) throw new NotFoundException('Rider not found');

    admin.riders = admin.riders.filter((r) => r.id !== riderId);

    return this.adminRepo.save(admin);
  }
}
