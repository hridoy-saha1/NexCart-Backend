import { Injectable } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorStatusDto } from './dto/update-vendor-status.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CommissionDto } from './dto/commission.dto';

@Injectable()
export class AdminService {
  createVendor(dto: CreateVendorDto) {
    return {
      success: true,
      message: 'Vendor created successfully',
      vendor: {
        id: 'V-101',
        name: dto.name,
        email: dto.email,
        businessName: dto.businessName,
        status: 'PENDING',
      },
    };
  }

  updateVendorStatus(id: string, dto: UpdateVendorStatusDto) {
    return {
      success: true,
      message: `Vendor ${dto.status}`,
      vendorId: id,
      status: dto.status,
    };
  }

  getVendors(page: number, status: string) {
    return {
      page: page || 1,
      filterStatus: status || 'ALL',
      vendors: [
        {
          id: 'V-101',
          name: 'Tech Store',
          status: 'APPROVED',
        },
        {
          id: 'V-102',
          name: 'Fashion Hub',
          status: 'PENDING',
        },
      ],
    };
  }

  suspendUser(id: string, reason: string) {
    return {
      success: true,
      message: 'User suspended successfully',
      userId: id,
      reason,
    };
  }

  createCategory(dto: CreateCategoryDto) {
    return {
      success: true,
      message: 'Category created',
      category: {
        id: 'C-101',
        name: dto.name,
      },
    };
  }

  getCategories() {
    return {
      categories: [
        { id: 'C-101', name: 'Electronics' },
        { id: 'C-102', name: 'Clothing' },
      ],
    };
  }

  getAnalytics() {
    return {
      totalSales: 100000,
      totalUsers: 500,
      totalOrders: 1200,
      revenue: 25000,
    };
  }

  setCommission(dto: CommissionDto) {
    return {
      success: true,
      message: 'Commission updated',
      commissionRate: dto.commissionRate,
    };
  }

  getOrders(page: number, status: string) {
    return {
      page: page || 1,
      filterStatus: status || 'ALL',
      orders: [
        {
          id: 'O-101',
          vendor: 'Tech Store',
          status: 'DELIVERED',
          amount: 1200,
        },
        {
          id: 'O-102',
          vendor: 'Fashion Hub',
          status: 'PENDING',
          amount: 800,
        },
      ],
    };
  }

  deleteVendor(id: string) {
    return {
      success: true,
      message: 'Vendor deleted successfully',
      vendorId: id,
    };
  }
}
