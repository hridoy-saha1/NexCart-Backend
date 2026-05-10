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
  OrderItem,
  SellerOrderItemStatus,
} from 'src/customer/order-item.entity';
import { Order } from 'src/customer/order.entity';
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

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

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

    // Optional but recommended
    const existingTradeLicense = await this.sellerShopRepository.findOne({
      where: { tradeLicense: dto.tradeLicense },
    });

    if (existingTradeLicense) {
      throw new BadRequestException('Trade license already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // =========================
    // CREATE SELLER
    // =========================

    const seller = this.sellerRepository.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      nidNumber: dto.nidNumber,
      nidImage: nidImage.filename,
      password: hashedPassword,
    });

    const savedSeller = await this.sellerRepository.save(seller);

    // =========================
    // CREATE SHOP
    // =========================

    const shop = this.sellerShopRepository.create({
      shopName: dto.shopName,
      shopAddress: dto.shopAddress,
      tradeLicense: dto.tradeLicense,
      seller: savedSeller,
    });

    await this.sellerShopRepository.save(shop);

    // =========================
    // FETCH SELLER WITH SHOP
    // =========================

    const sellerWithShop = await this.sellerRepository.findOne({
      where: {
        id: savedSeller.id,
      },
      relations: {
        shop: true,
      },
    });

    const { password, ...sellerWithoutPassword } = sellerWithShop!;

    return {
      message: 'Seller registered successfully',
      data: sellerWithoutPassword,
    };
  }

  async loginSeller(dto: LoginDto): Promise<object> {
    const seller = await this.sellerRepository.findOne({
      where: { email: dto.email },
      relations: {
        shop: true,
      },
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

  async updateSeller(
    id: number,
    dto: UpdateSellerDto,
    nidImage?: Express.Multer.File,
  ): Promise<object> {
    const seller = await this.sellerRepository.findOne({
      where: { id },
      relations: {
        shop: true,
      },
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

    if (nidImage) {
      seller.nidImage = nidImage.filename;
    }

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
    throw new BadRequestException(
      'Use POST /seller/:sellerId/products to create a product for a seller shop',
    );
  }

  async createProductForSeller(
    sellerId: number,
    dto: CreateProductDto,
    productImage?: Express.Multer.File,
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

    if (!seller.shop) {
      throw new BadRequestException(
        'Seller shop not found. Please create a seller shop before adding products.',
      );
    }

    const product = this.productRepository.create({
      productName: dto.productName,
      category: dto.category,
      description: dto.description,
      price: dto.price,
      quantity: dto.quantity,
      productImage: productImage ? productImage.filename : null,
      seller,
      sellerShop: seller.shop,
    });

    const savedProduct = await this.productRepository.save(product);

    const productWithRelations = await this.productRepository.findOne({
      where: { id: savedProduct.id },
      relations: {
        seller: true,
        sellerShop: true,
      },
    });

    return {
      message: 'Product created successfully for seller shop',
      data: productWithRelations,
    };
  }

  async getAllProducts(): Promise<object> {
    const products = await this.productRepository.find({
      relations: {
        seller: true,
        sellerShop: true,
      },
      order: {
        id: 'DESC',
      },
    });

    const safeProducts = products.map((product) => {
      if (product.seller) {
        const { password, ...safeSeller } = product.seller;
        return {
          ...product,
          seller: safeSeller,
        };
      }

      return product;
    });

    return {
      message: 'All products retrieved successfully',
      data: safeProducts,
    };
  }

  async getProductsBySeller(sellerId: number): Promise<object> {
    const seller = await this.sellerRepository.findOne({
      where: { id: sellerId },
      relations: {
        shop: true,
      },
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
        sellerShop: true,
      },
      order: {
        id: 'DESC',
      },
    });

    const safeProducts = products.map((product) => {
      if (product.seller) {
        const { password, ...safeSeller } = product.seller;
        return {
          ...product,
          seller: safeSeller,
        };
      }

      return product;
    });

    return {
      message: `Products for seller ID ${sellerId} retrieved successfully`,
      data: safeProducts,
    };
  }

  async getProductById(id: number): Promise<object> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        seller: true,
        sellerShop: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (product.seller) {
      const { password, ...safeSeller } = product.seller;

      return {
        message: 'Product retrieved successfully',
        data: {
          ...product,
          seller: safeSeller,
        },
      };
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
      relations: {
        seller: true,
        sellerShop: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    Object.assign(product, dto);

    if (productImage) {
      product.productImage = productImage.filename;
    }

    const updatedProduct = await this.productRepository.save(product);

    const productWithRelations = await this.productRepository.findOne({
      where: { id: updatedProduct.id },
      relations: {
        seller: true,
        sellerShop: true,
      },
    });

    if (productWithRelations?.seller) {
      const { password, ...safeSeller } = productWithRelations.seller;

      return {
        message: `Product with ID ${id} updated successfully`,
        data: {
          ...productWithRelations,
          seller: safeSeller,
        },
      };
    }

    return {
      message: `Product with ID ${id} updated successfully`,
      data: productWithRelations,
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

    const existingTradeLicense = await this.sellerShopRepository.findOne({
      where: {
        tradeLicense: dto.tradeLicense,
      },
    });

    if (existingTradeLicense) {
      throw new BadRequestException('Trade license already exists');
    }

    const shop = this.sellerShopRepository.create({
      shopName: dto.shopName,
      shopAddress: dto.shopAddress,
      tradeLicense: dto.tradeLicense,
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
        products: true,
      },
    });

    if (!shop) {
      throw new NotFoundException(`Shop with ID ${shopId} not found`);
    }

    if (dto.tradeLicense && dto.tradeLicense !== shop.tradeLicense) {
      const existingTradeLicense = await this.sellerShopRepository.findOne({
        where: {
          tradeLicense: dto.tradeLicense,
        },
      });

      if (existingTradeLicense) {
        throw new BadRequestException('Trade license already exists');
      }
    }

    Object.assign(shop, dto);

    const updatedShop = await this.sellerShopRepository.save(shop);

    return {
      message: `Shop with ID ${shopId} updated successfully`,
      data: updatedShop,
    };
  }

  // async getOrdersBySeller(id: number): Promise<object> {
  //   const orders = await this.orderItemRepository.find({
  //     where: { seller: { id } },
  //     relations: ['order', 'product', 'product.seller'],
  //   });

  //   return {
  //     message: 'Orders retrieved successfully',
  //     data: orders,
  //   };
  // }

  // async getSellerOrders(sellerId: number) {
  //   const orders = await this.orderRepository.find({
  //     relations: [
  //       'customer',
  //       'orderItems',
  //       'orderItems.product',
  //       'orderItems.seller',
  //     ],

  //     order: {
  //       createdAt: 'DESC',
  //     },
  //   });

  //   // keep only seller's items
  //   const sellerOrders = orders
  //     .map((order) => {
  //       const sellerItems = order.orderItems.filter(
  //         (item) => item.seller?.id === sellerId,
  //       );

  //       return {
  //         ...order,
  //         orderItems: sellerItems,
  //       };
  //     })
  //     .filter((order) => order.orderItems.length > 0);

  //   return sellerOrders;
  // }

  // async getSellerOrders(sellerId: number) {
  //   const orderItems = await this.orderItemRepository.find({
  //     where: {
  //       seller: { id: sellerId },
  //     },
  //     relations: ['order', 'order.customer', 'product'],
  //     order: {
  //       order: {
  //         createdAt: 'DESC',
  //       },
  //     },
  //   });

  //   // group by order
  //   const grouped = new Map();

  //   for (const item of orderItems) {
  //     const orderId = item.order.id;

  //     if (!grouped.has(orderId)) {
  //       grouped.set(orderId, {
  //         ...item.order,
  //         orderItems: [],
  //       });
  //     }

  //     grouped.get(orderId).orderItems.push(item);
  //   }

  //   return Array.from(grouped.values());
  // }

  async getSellerOrders(sellerId: number) {
    const orderItems = await this.orderItemRepository.find({
      where: {
        seller: { id: sellerId },
      },
      relations: ['order', 'order.customer', 'product'],
      order: {
        order: {
          createdAt: 'DESC',
        },
      },
    });

    const grouped = new Map();

    for (const item of orderItems) {
      const orderId = item.order.id;

      if (!grouped.has(orderId)) {
        grouped.set(orderId, {
          id: item.order.id,
          customer: item.order.customer,
          paymentMethod: item.order.paymentMethod,
          totalAmount: item.order.totalAmount,
          createdAt: item.order.createdAt,

          // 👇 IMPORTANT: seller-specific items
          orderItems: [],
        });
      }

      grouped.get(orderId).orderItems.push({
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        price: item.price,

        // 🔥 THIS is what you were missing
        status: item.status,
      });
    }

    return Array.from(grouped.values());
  }

  async updateOrderItemStatus(
    itemId: number,
    sellerId: number,
    status: SellerOrderItemStatus,
  ) {
    const item = await this.orderItemRepository.findOne({
      where: {
        id: itemId,
        seller: { id: sellerId },
      },

      relations: ['order'],
    });

    if (!item) {
      throw new Error('Order item not found');
    }

    // UPDATE SELLER ITEM STATUS
    item.status = status;

    await this.orderItemRepository.save(item);

    // AUTO UPDATE MAIN ORDER STATUS
    await this.updateMainOrderStatus(item.order.id);

    return {
      message: 'Order item updated successfully',
    };
  }

  async updateMainOrderStatus(orderId: number) {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },

      relations: ['orderItems'],
    });

    if (!order) return;

    const items = order.orderItems;

    // ALL REJECTED
    if (items.every((i) => i.status === SellerOrderItemStatus.REJECTED)) {
      order.status = 'cancelled';
    }

    // PARTIAL
    else if (
      items.some(
        (i) =>
          i.status === SellerOrderItemStatus.ACCEPTED ||
          i.status === SellerOrderItemStatus.SHIPPED,
      ) &&
      items.some((i) => i.status === SellerOrderItemStatus.REJECTED)
    ) {
      order.status = 'partial';
    }

    // ALL SHIPPED
    else if (items.every((i) => i.status === SellerOrderItemStatus.SHIPPED)) {
      order.status = 'delivered';
    }

    // ALL ACCEPTED
    else if (
      items.every(
        (i) =>
          i.status === SellerOrderItemStatus.ACCEPTED ||
          i.status === SellerOrderItemStatus.SHIPPED,
      )
    ) {
      order.status = 'accepted';
    }

    // DEFAULT
    else {
      order.status = 'pending';
    }

    await this.orderRepository.save(order);
  }
}
