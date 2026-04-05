//new
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SellerEntity } from './seller.entity';
import { ProductEntity } from './product.entity';

import { SellerRegistrationDto, UpdateSellerDto } from './seller.dto';
import { CreateProductDto, UpdateProductDto } from './product.dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  // =========================
  // Seller CRUD
  // =========================

  async createSeller(
    dto: SellerRegistrationDto,
    nidImage: Express.Multer.File,
  ): Promise<object> {
    if (!nidImage) {
      throw new BadRequestException('NID image is required');
    }

    const seller = this.sellerRepository.create({
      fullName: dto.name,
      email: dto.email,
      phone: dto.phone,
      nidNumber: dto.nidNumber,
      nidImage: nidImage.filename,
    });

    const savedSeller = await this.sellerRepository.save(seller);

    return {
      message: 'Seller created successfully',
      data: savedSeller,
    };
  }

  async getAllSellers(): Promise<object> {
    const sellers = await this.sellerRepository.find();

    return {
      message: 'All sellers retrieved successfully',
      data: sellers,
    };
  }

  async getSellerById(id: number): Promise<object> {
    const seller = await this.sellerRepository.findOne({
      where: { id },
    });

    if (!seller) {
      throw new NotFoundException(`Seller with ID ${id} not found`);
    }

    return {
      message: 'Seller retrieved successfully',
      data: seller,
    };
  }

  async updateSeller(id: number, dto: UpdateSellerDto): Promise<object> {
    const seller = await this.sellerRepository.findOne({
      where: { id },
    });

    if (!seller) {
      throw new NotFoundException(`Seller with ID ${id} not found`);
    }

    Object.assign(seller, dto);

    const updatedSeller = await this.sellerRepository.save(seller);

    return {
      message: `Seller with ID ${id} updated successfully`,
      data: updatedSeller,
    };
  }

  async deleteSeller(id: number): Promise<object> {
    const seller = await this.sellerRepository.findOne({
      where: { id },
    });

    if (!seller) {
      throw new NotFoundException(`Seller with ID ${id} not found`);
    }

    await this.sellerRepository.remove(seller);

    return {
      message: `Seller with ID ${id} deleted successfully`,
    };
  }

  // =========================
  // Product CRUD
  // =========================

  async createProduct(dto: CreateProductDto): Promise<object> {
    const product = this.productRepository.create(dto);
    const savedProduct = await this.productRepository.save(product);

    return {
      message: 'Product created successfully',
      data: savedProduct,
    };
  }

  async getAllProducts(): Promise<object> {
    const products = await this.productRepository.find();

    return {
      message: 'All products retrieved successfully',
      data: products,
    };
  }

  async getProductById(id: number): Promise<object> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return {
      message: 'Product retrieved successfully',
      data: product,
    };
  }

  // async replaceProduct(id: number, dto: UpdateProductDto): Promise<object> {
  //   const product = await this.productRepository.findOne({
  //     where: { id },
  //   });

  //   if (!product) {
  //     throw new NotFoundException(`Product with ID ${id} not found`);
  //   }

  //   product.productName = dto.productName;
  //   product.category = dto.category;
  //   product.price = dto.price;
  //   product.quantity = dto.quantity;
  //   product.description = dto.description;

  //   const updatedProduct = await this.productRepository.save(product);

  //   return {
  //     message: `Product with ID ${id} replaced successfully`,
  //     data: updatedProduct,
  //   };
  // }

  async updateProduct(id: number, dto: UpdateProductDto): Promise<object> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    Object.assign(product, dto);

    const updatedProduct = await this.productRepository.save(product);

    return {
      message: `Product with ID ${id} updated successfully`,
      data: updatedProduct,
    };
  }

  async deleteProduct(id: number): Promise<object> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.remove(product);

    return {
      message: `Product with ID ${id} deleted successfully`,
    };
  }
}
