import { Module } from '@nestjs/common';
import { RiderController } from './rider.controller';
import { RiderService } from './rider.service';
@Module({
  imports: [],
  controllers: [RiderController],
  providers: [RiderService],
})
export class RiderModule {}
