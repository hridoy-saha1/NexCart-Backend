import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { AdminEntity } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Order } from '../customer/order.entity';
import { Rider } from '../rider/rider.entity';
import * as bcrypt from 'bcrypt';
import { LoginAdminDto } from './dto/login-admin.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
// import { VerifyOtpDto } from './dto/verify-otp.dto';
import { PusherService } from '../pusher/pusher.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,

    @InjectRepository(Rider)
    private readonly riderRepo: Repository<Rider>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    private readonly jwtService: JwtService,

    private readonly mailerService: MailerService,
    private readonly pusherService: PusherService,
  ) {}

  // OTP Generator
  // generateOtp(): string {
  //   return Math.floor(100000 + Math.random() * 900000).toString();
  // }

  // create
  async create(dto: CreateAdminDto): Promise<AdminEntity> {
    // check duplicate email
    const existing = await this.adminRepo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    // hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    // GENERATE OTP
    // const otp = this.generateOtp();

    // CREATE ADMIN
    const admin = this.adminRepo.create({
      ...dto,
      password: hashedPassword,
      // otp,
      // otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
      // isVerified: false,
      isApproved: false,
    });

    const savedAdmin = await this.adminRepo.save(admin);

    // SEND OTP EMAIL
    //   try {
    //     await this.mailerService.sendMail({
    //       to: savedAdmin.email,
    //       subject: 'Verify Your Account - NexCart',
    //       html: `
    //   <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">

    //     <h3>OTP Verification</h3>

    //     <p>Hello ${savedAdmin.name},</p>

    //     <p>Your OTP code is:</p>

    //     <p style="font-size: 20px; font-weight: bold;">
    //       ${otp}
    //     </p>

    //     <p>This OTP will expire in 5 minutes.</p>

    //     <p>If you didn’t request this, please ignore this email.</p>

    //   </div>
    // `,
    //     });
    // Send welcome email only
    try {
      await this.mailerService.sendMail({
        to: savedAdmin.email,
        subject: 'Welcome to NexCart Admin',
        html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Welcome, ${savedAdmin.name}!</h2>
          <p>Your admin account has been created successfully.</p>
          <p>Your request is pending approval by an existing admin.</p>
          <p>You will be able to login once approved.</p>
        </div>
      `,
      });
    } catch (error) {
      console.error('Email error:', error);
    }

    return savedAdmin;
  }

  // VERIFY OTP
  // async verifyOtp(dto: VerifyOtpDto) {
  //   const { email, otp } = dto;

  //   const admin = await this.adminRepo.findOne({ where: { email } });

  //   if (!admin) throw new NotFoundException('Admin not found');

  //   if (admin.isVerified) {
  //     throw new BadRequestException('Already verified');
  //   }

  //   if (!admin.otpExpiry) {
  //     throw new BadRequestException('OTP not found');
  //   }

  //   if (admin.otp !== otp) {
  //     throw new BadRequestException('Invalid OTP');
  //   }

  //   if (admin.otpExpiry && admin.otpExpiry < new Date()) {
  //     throw new BadRequestException('OTP expired');
  //   }

  //   admin.isVerified = true;
  //   admin.otp = null;
  //   admin.otpExpiry = null;

  //   await this.adminRepo.save(admin);

  //   return {
  //     message: 'OTP verified successfully',
  //   };
  // }

  // async resendOtp() {
  //   // Find the latest unverified admin
  //   const admin = await this.adminRepo.findOne({
  //     where: { isVerified: false },
  //     order: { createdAt: 'DESC' }, // get the most recently registered
  //   });

  //   if (!admin) throw new NotFoundException('No pending verification found');

  //   const otp = this.generateOtp();
  //   admin.otp = otp;
  //   admin.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  //   await this.adminRepo.save(admin);

  //   await this.mailerService.sendMail({
  //     to: admin.email,
  //     subject: 'Verify Your Account - NexCart',
  //     html: `
  //   <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">

  //     <h3>OTP Verification</h3>

  //     <p>Hello ${admin.name},</p>

  //     <p>Your OTP code is:</p>

  //     <p style="font-size: 20px; font-weight: bold;">
  //       ${otp}
  //     </p>

  //     <p>This OTP will expire in 5 minutes.</p>

  //     <p>If you didn’t request this, please ignore this email.</p>

  //   </div>
  // `,
  //   });

  //   return { message: 'OTP resent successfully' };
  // }

  // login
  async login(dto: LoginAdminDto) {
    const { email, password } = dto;

    // find admin
    const admin = await this.adminRepo.findOne({
      where: { email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid email');
    }

    // if (!admin.isVerified) {
    //   throw new UnauthorizedException('Verify OTP first');
    // }

    if (!admin.isApproved) {
      throw new UnauthorizedException('Your account is pending approval');
    }

    if (!admin.isActive) {
      throw new UnauthorizedException('Your account has been deactivated');
    }

    // compare password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    // CREATE TOKEN
    const payload = {
      sub: admin.id,
      email: admin.email,
    };

    const access_token = this.jwtService.sign(payload);

    // RETURN TOKEN
    return {
      message: 'Login successful',
      access_token,
    };
  }

  // Approve admin
  async approveAdmin(id: number) {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');
    admin.isApproved = true;
    admin.isActive = true;
    await this.adminRepo.save(admin);
    return { message: 'Admin approved successfully' };
  }

  // Deny/remove admin
  async denyAdmin(id: number) {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');
    await this.adminRepo.remove(admin);
    return { message: 'Admin denied and removed' };
  }

  // Deactivate admin (soft delete)
  async deactivateAdmin(id: number) {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');
    admin.isActive = false;
    await this.adminRepo.save(admin);
    return { message: 'Admin deactivated successfully' };
  }

  // Reactivate admin
  async activateAdmin(id: number) {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');
    admin.isActive = true;
    await this.adminRepo.save(admin);
    return { message: 'Admin activated successfully' };
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

    // hash password again
    const salt = await bcrypt.genSalt();
    admin.password = await bcrypt.hash(dto.password, salt);

    return this.adminRepo.save(admin);
  }

  // PATCH (Partial update)
  async partialUpdate(id: number, dto: UpdateAdminDto): Promise<AdminEntity> {
    const admin = await this.findOne(id);

    if (dto.name !== undefined) admin.name = dto.name;
    if (dto.email !== undefined) admin.email = dto.email;

    if (dto.password !== undefined) {
      const salt = await bcrypt.genSalt();
      admin.password = await bcrypt.hash(dto.password, salt);
    }

    return this.adminRepo.save(admin);
  }

  // DELETE
  // async remove(id: number): Promise<{ message: string }> {
  //   const admin = await this.adminRepo.findOne({
  //     where: { id },
  // relations: ['riders'], // load relations
  // });

  // if (!admin) {
  //   throw new NotFoundException('Admin not found');
  // }

  // remove relations
  // admin.riders = [];

  // await this.adminRepo.save(admin); // clear join table

  //   await this.adminRepo.remove(admin);

  //   return {
  //     message: 'Admin deleted successfully',
  //   };
  // }

  // Assign Rider to Admin
  // async assignRider(adminId: number, riderId: number): Promise<AdminEntity> {
  //   const admin = await this.adminRepo.findOne({
  //     where: { id: adminId },
  //     relations: ['riders'],
  //   });

  //   if (!admin) throw new NotFoundException('Admin not found');

  //   const rider = await this.riderRepo.findOneBy({ id: riderId });
  //   if (!rider) throw new NotFoundException('Rider not found');

  // if (admin.riders.some((r) => r.id === rider.id)) {
  //   throw new BadRequestException('Rider already assigned');
  // }

  // admin.riders.push(rider);
  //   return this.adminRepo.save(admin);
  // }

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
  // async getAdminWithRiders(id: number): Promise<AdminEntity> {
  //   const admin = await this.adminRepo.findOne({
  //     where: { id },
  //     relations: ['riders'],
  //   });

  //   if (!admin) throw new NotFoundException('Admin not found');

  //   return admin;
  // }

  // Remove Rider from Admin
  // async removeRider(adminId: number, riderId: number): Promise<AdminEntity> {
  //   const admin = await this.adminRepo.findOne({
  //     where: { id: adminId },
  //     relations: ['riders'],
  //   });

  //   if (!admin) throw new NotFoundException('Admin not found');

  //   const rider = admin.riders.find((r) => r.id === riderId);
  //   if (!rider) throw new NotFoundException('Rider not found');

  //   admin.riders = admin.riders.filter((r) => r.id !== riderId);

  //   return this.adminRepo.save(admin);
  // }
}
