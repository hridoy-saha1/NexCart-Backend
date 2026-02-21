import { BadRequestException, Injectable } from '@nestjs/common';
import { SellerRegistrationDto } from './seller.dto';

import {
  CreateProductDto,
  UpdateProductDto,
  UpdateOrderStatusDto,
  PayoutRequestDto,
} from './seller.dto';

@Injectable()
export class SellerService {
  createProduct(obj: CreateProductDto): object {
    return {
      message: 'Product created successfully',
      data: obj,
    };
  }

  updateProduct(id: number, dto: UpdateProductDto): object {
    return {
      message: `Product with ID ${id} updated successfully`,
      updatedData: dto,
    };
  }

  deleteProduct(id: number): object {
    return {
      message: `Product with ID ${id} deleted successfully`,
    };
  }

  getMyProducts(): object {
    return {
      message: 'List of seller products',
      products: [
        { id: 1, name: 'Apple', price: 20 },
        { id: 2, name: 'Mango', price: 30 },
      ],
    };
  }

  getIncomingOrders(): object {
    return {
      message: 'Incoming orders',
      orders: [
        { orderId: 101, status: 'CONFIRMED', total: 1200 },
        { orderId: 102, status: 'PACKED', total: 500 },
      ],
    };
  }

  updateOrderStatus(id: number, dto: UpdateOrderStatusDto): object {
    return {
      message: `Order ${id} status updated successfully`,
      newStatus: dto.status,
    };
  }

  getSalesAnalytics(): object {
    return {
      totalSales: 15000,
      totalOrders: 120,
      totalProducts: 25,
    };
  }

  requestPayout(dto: PayoutRequestDto): object {
    return {
      message: 'Payout request submitted successfully',
      payoutDetails: dto,
    };
  }

  registerSeller(
    dto: SellerRegistrationDto,
    nidImage: Express.Multer.File,
  ): object {
    if (!nidImage) {
      throw new BadRequestException('NID image is required');
    }

    return {
      message: 'Seller registered successfully',
      data: {
        name: dto.name,
        email: dto.email,
        nidNumber: dto.nidNumber,
        nidImage: {
          originalName: nidImage.originalname,
          fileName: nidImage.filename,
          mimeType: nidImage.mimetype,
          size: nidImage.size,
          destination: nidImage.destination,
          path: nidImage.path,
        },
      },
    };
  }
}

//
