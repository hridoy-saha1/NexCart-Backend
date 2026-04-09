import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rider } from './rider.entity';
import { RiderController } from './rider.controller';
import { RiderService } from './rider.service';
import { Review } from './review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rider,Review])],
  controllers: [RiderController],
  providers: [RiderService],
})
export class RiderModule {}