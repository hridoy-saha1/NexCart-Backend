/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { AdminEntity } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,
  ) {}

  // CREATE
  async create(dto: CreateAdminDto): Promise<AdminEntity> {
    const admin = this.adminRepo.create(dto);
    return await this.adminRepo.save(admin);
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
    const admin: AdminEntity = await this.findOne(id);

    admin.name = dto.name;
    admin.email = dto.email;
    admin.password = dto.password;
    admin.isActive = dto.isActive ?? admin.isActive;

    return await this.adminRepo.save(admin);
  }

  // PATCH (Partial update)
  async partialUpdate(id: number, dto: UpdateAdminDto): Promise<AdminEntity> {
    const admin: AdminEntity = await this.findOne(id);

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
}
