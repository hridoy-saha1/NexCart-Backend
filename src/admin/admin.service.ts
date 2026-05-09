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
import { Order } from 'src/customer/order.entity';
import { Rider } from 'src/rider/rider.entity';
import * as bcrypt from 'bcrypt';
import { LoginAdminDto } from './dto/login-admin.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifyOtpDto } from './dto/verify-otp.dto';

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
  ) {}

  // OTP Generator
  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

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
    const otp = this.generateOtp();

    // CREATE ADMIN
    const admin = this.adminRepo.create({
      ...dto,
      password: hashedPassword,
      otp,
      otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
      isVerified: false,
    });

    const savedAdmin = await this.adminRepo.save(admin);

    // SEND OTP EMAIL
    try {
      await this.mailerService.sendMail({
        to: savedAdmin.email,
        subject: 'Verify Your Account - NexCart',
        html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      
      <h3>OTP Verification</h3>

      <p>Hello ${savedAdmin.name},</p>

      <p>Your OTP code is:</p>

      <p style="font-size: 20px; font-weight: bold;">
        ${otp}
      </p>

      <p>This OTP will expire in 5 minutes.</p>

      <p>If you didn’t request this, please ignore this email.</p>

    </div>
  `,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Email error:', error);
    }

    return savedAdmin;
  }

  // VERIFY OTP
  async verifyOtp(dto: VerifyOtpDto) {
    const { email, otp } = dto;

    const admin = await this.adminRepo.findOne({ where: { email } });

    if (!admin) throw new NotFoundException('Admin not found');

    if (admin.isVerified) {
      throw new BadRequestException('Already verified');
    }

    if (!admin.otpExpiry) {
      throw new BadRequestException('OTP not found');
    }

    if (admin.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (admin.otpExpiry && admin.otpExpiry < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    admin.isVerified = true;
    admin.otp = null;
    admin.otpExpiry = null;

    await this.adminRepo.save(admin);

    return {
      message: 'OTP verified successfully',
    };
  }

  async resendOtp() {
    // Find the latest unverified admin
    const admin = await this.adminRepo.findOne({
      where: { isVerified: false },
      order: { createdAt: 'DESC' }, // get the most recently registered
    });

    if (!admin) throw new NotFoundException('No pending verification found');

    const otp = this.generateOtp();
    admin.otp = otp;
    admin.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await this.adminRepo.save(admin);

    await this.mailerService.sendMail({
      to: admin.email,
      subject: 'Verify Your Account - NexCart',
      html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      
      <h3>OTP Verification</h3>

      <p>Hello ${admin.name},</p>

      <p>Your OTP code is:</p>

      <p style="font-size: 20px; font-weight: bold;">
        ${otp}
      </p>

      <p>This OTP will expire in 5 minutes.</p>

      <p>If you didn’t request this, please ignore this email.</p>

    </div>
  `,
    });

    return { message: 'OTP resent successfully' };
  }

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

    if (!admin.isVerified) {
      throw new UnauthorizedException('Verify OTP first');
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

    admin.isActive = dto.isActive ?? admin.isActive;

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

    if (dto.isActive !== undefined) admin.isActive = dto.isActive;

    return this.adminRepo.save(admin);
  }

  // DELETE
  async remove(id: number): Promise<{ message: string }> {
    const admin = await this.adminRepo.findOne({
      where: { id },
      relations: ['riders'], // load relations
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // remove relations
    admin.riders = [];

    await this.adminRepo.save(admin); // clear join table

    await this.adminRepo.remove(admin);

    return {
      message: 'Admin deleted successfully',
    };
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
    return this.orderRepo.save(order);
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
