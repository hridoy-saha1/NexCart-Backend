import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rider } from './rider.entity';


import { Review } from './review.entity';




@Injectable()
export class RiderService {

  constructor(
    @InjectRepository(Rider)
    private riderRepository: Repository<Rider>,
     @InjectRepository(Review)
  private reviewRepository: Repository<Review>,
  ) {}

  async createRider(dto: any): Promise<Rider> {
    return await this.riderRepository.save(dto);
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
    return await this.riderRepository.find({
      relations: ['admins'],
    });
  }

  async getRider(id: number): Promise<Rider> {
    const rider = await this.riderRepository.findOne({
      where: { id },
    });

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
}