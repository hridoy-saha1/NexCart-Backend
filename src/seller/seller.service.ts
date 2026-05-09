import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { SellerEntity } from './entities/seller.entity';
import { ProductEntity } from './entities/product.entity';
import { SellerShopEntity } from './entities/seller-shop.entity';

import {
  SellerRegistrationDto,
  UpdateSellerDto,
  LoginDto,
} from './dtos/seller.dto';

import { CreateProductDto, UpdateProductDto } from './dtos/product.dto';

import {
  CreateSellerShopDto,
  UpdateSellerShopDto,
} from './dtos/seller-shop.dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(SellerShopEntity)
    private readonly sellerShopRepository: Repository<SellerShopEntity>,

    private readonly jwtService: JwtService,
  ) {}

  // =========================
  // Seller Auth
  // =========================

  async createSeller(
    dto: SellerRegistrationDto,
    nidImage: Express.Multer.File,
  ): Promise<object> {
    if (!nidImage) {
      throw new BadRequestException('NID image is required');
    }

    const existingEmail = await this.sellerRepository.findOne({
      where: { email: dto.email },
    });

    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    const existingPhone = await this.sellerRepository.findOne({
      where: { phone: dto.phone },
    });

    if (existingPhone) {
      throw new BadRequestException('Phone number already exists');
    }

    const existingNid = await this.sellerRepository.findOne({
      where: { nidNumber: dto.nidNumber },
    });

    if (existingNid) {
      throw new BadRequestException('NID number already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const seller = this.sellerRepository.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      nidNumber: dto.nidNumber,
      nidImage: nidImage.filename,
      password: hashedPassword,
    });

    const savedSeller = await this.sellerRepository.save(seller);

    const { password, ...sellerWithoutPassword } = savedSeller;

    return {
      message: 'Seller registered successfully',
      data: sellerWithoutPassword,
    };
  }

  async loginSeller(dto: LoginDto): Promise<object> {
    const seller = await this.sellerRepository.findOne({
      where: { email: dto.email },
    });

    if (!seller) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(
      dto.password,
      seller.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: seller.id,
      email: seller.email,
      role: 'seller',
    };

    const access_token = await this.jwtService.signAsync(payload);

    const { password, ...sellerWithoutPassword } = seller;

    return {
      message: 'Seller login successful',
      access_token,
      seller: sellerWithoutPassword,
    };
  }

  // =========================
  // Seller CRUD
  // =========================

  async getAllSellers(): Promise<object> {
    const sellers = await this.sellerRepository.find({
      relations: {
        products: true,
        shop: true,
      },
    });

    const sellersWithoutPassword = sellers.map((seller) => {
      const { password, ...safeSeller } = seller;
      return safeSeller;
    });

    return {
      message: 'All sellers retrieved successfully',
      data: sellersWithoutPassword,
    };
  }

  async getSellerById(id: number): Promise<object> {
    const seller = await this.sellerRepository.findOne({
      where: { id },
      relations: {
        products: true,
        shop: true,
      },
    });

    if (!seller) {
      throw new NotFoundException(`Seller with ID ${id} not found`);
    }

    const { password, ...sellerWithoutPassword } = seller;

    return {
      message: 'Seller retrieved successfully',
      data: sellerWithoutPassword,
    };
  }

  async updateSeller(id: number, dto: UpdateSellerDto): Promise<object> {
    const seller = await this.sellerRepository.findOne({
      where: { id },
    });

    if (!seller) {
      throw new NotFoundException(`Seller with ID ${id} not found`);
    }

    if (dto.email && dto.email !== seller.email) {
      const existingEmail = await this.sellerRepository.findOne({
        where: { email: dto.email },
      });

      if (existingEmail) {
        throw new BadRequestException('Email already exists');
      }
    }

    if (dto.phone && dto.phone !== seller.phone) {
      const existingPhone = await this.sellerRepository.findOne({
        where: { phone: dto.phone },
      });

      if (existingPhone) {
        throw new BadRequestException('Phone number already exists');
      }
    }

    if (dto.nidNumber && dto.nidNumber !== seller.nidNumber) {
      const existingNid = await this.sellerRepository.findOne({
        where: { nidNumber: dto.nidNumber },
      });

      if (existingNid) {
        throw new BadRequestException('NID number already exists');
      }
    }

    Object.assign(seller, dto);

    const updatedSeller = await this.sellerRepository.save(seller);

    const { password, ...sellerWithoutPassword } = updatedSeller;

    return {
      message: `Seller with ID ${id} updated successfully`,
      data: sellerWithoutPassword,
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

  async createProduct(
    dto: CreateProductDto,
    productImage?: Express.Multer.File,
  ): Promise<object> {
    const product = this.productRepository.create({
      productName: dto.productName,
      category: dto.category,
      description: dto.description,
      price: dto.price,
      quantity: dto.quantity,
      productImage: productImage ? productImage.filename : null,
    });

    const savedProduct = await this.productRepository.save(product);

    return {
      message: 'Product created successfully',
      data: savedProduct,
    };
  }

  async createProductForSeller(
    sellerId: number,
    dto: CreateProductDto,
    productImage?: Express.Multer.File,
  ): Promise<object> {
    const seller = await this.sellerRepository.findOne({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundException(`Seller with ID ${sellerId} not found`);
    }

    const product = this.productRepository.create({
      productName: dto.productName,
      category: dto.category,
      description: dto.description,
      price: dto.price,
      quantity: dto.quantity,
      productImage: productImage ? productImage.filename : null,
      seller,
    });

    const savedProduct = await this.productRepository.save(product);

    return {
      message: 'Product created successfully for seller',
      data: savedProduct,
    };
  }

  async getAllProducts(): Promise<object> {
    const products = await this.productRepository.find({
      relations: {
        seller: true,
      },
    });

    return {
      message: 'All products retrieved successfully',
      data: products,
    };
  }

  async getProductsBySeller(sellerId: number): Promise<object> {
    const seller = await this.sellerRepository.findOne({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundException(`Seller with ID ${sellerId} not found`);
    }

    const products = await this.productRepository.find({
      where: {
        seller: {
          id: sellerId,
        },
      },
      relations: {
        seller: true,
      },
    });

    return {
      message: `Products for seller ID ${sellerId} retrieved successfully`,
      data: products,
    };
  }

  async getProductById(id: number): Promise<object> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        seller: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return {
      message: 'Product retrieved successfully',
      data: product,
    };
  }

  async updateProduct(
    id: number,
    dto: UpdateProductDto,
    productImage?: Express.Multer.File,
  ): Promise<object> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    Object.assign(product, dto);

    if (productImage) {
      product.productImage = productImage.filename;
    }

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

  // =========================
  // Seller Shop CRUD
  // =========================

  async createSellerShop(
    sellerId: number,
    dto: CreateSellerShopDto,
  ): Promise<object> {
    const seller = await this.sellerRepository.findOne({
      where: { id: sellerId },
      relations: {
        shop: true,
      },
    });

    if (!seller) {
      throw new NotFoundException(`Seller with ID ${sellerId} not found`);
    }

    if (seller.shop) {
      throw new BadRequestException('This seller already has a shop');
    }

    const shop = this.sellerShopRepository.create({
      ...dto,
      seller,
    });

    const savedShop = await this.sellerShopRepository.save(shop);

    return {
      message: 'Seller shop created successfully',
      data: savedShop,
    };
  }

  async updateSellerShop(
    shopId: number,
    dto: UpdateSellerShopDto,
  ): Promise<object> {
    const shop = await this.sellerShopRepository.findOne({
      where: { id: shopId },
      relations: {
        seller: true,
      },
    });

    if (!shop) {
      throw new NotFoundException(`Shop with ID ${shopId} not found`);
    }

    Object.assign(shop, dto);

    const updatedShop = await this.sellerShopRepository.save(shop);

    return {
      message: `Shop with ID ${shopId} updated successfully`,
      data: updatedShop,
    };
  }
}
