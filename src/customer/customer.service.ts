import { CreateCustomerDto, UpdateProfileDto } from './customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { customerEntity } from './customer.entity';
import { Like, Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import { ProductEntity } from 'src/seller/product.entity';
import { CartItem } from './cart-item.entity';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mail.service';
import { ProductEntity } from 'src/seller/entities/product.entity';
import { profile } from 'console';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(customerEntity)
    private userRepository: Repository<customerEntity>,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(CartItem)
    private cartRepo: Repository<CartItem>,

    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,
    private readonly jwtService: JwtService,
    private mailService: MailService,
  ) {}
  async createUser(dto: CreateCustomerDto): Promise<customerEntity> {
    try {
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

      dto.password = hashedPassword;

      // Save user
      const user = await this.userRepository.save(dto);

      // Send mail
      await this.mailService.sendWelcomeEmail(user.email, user.name);

      return user;
    } catch (error) {
      // Duplicate Email Error
      if (error.code === '23505') {
        throw new BadRequestException('Email already exists');
      }

      throw error;
    }
  }
  ///////////////
  async login(body): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: body.email },
    });

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(payload, {
      secret: 'mySecretKey',
    });

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
      },
      token,
    };
  }
  async getProfile(id: number): Promise<object> {
    console.log('🔥 SERVICE HIT, ID =', id);

    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
    };
  }
  async updateProfile(
    id: number,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('User not found');

    // Only save the file name in DB
    if (file) user.profilePic = file.filename;

    Object.assign(user, dto);

    await this.userRepository.save(user);
    return {
      id: user.id,
      name: user.name,
      profilePic: user.profilePic,
      email: user.email,
    };
  }
  ///////////////////
  async getAllProducts(): Promise<ProductEntity[]> {
    return await this.productRepository.find();
  }
  async getProductById(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new BadRequestException(`Product not found with id ${id}`);
    }

    return product;
  }

  async searchProduct(name: string): Promise<ProductEntity[]> {
    return await this.productRepository.find({
      where: { productName: Like(`%${name}%`) },
    });
  }
  //Relationship start
  async addToCart(customerId: number, productId: number) {
    const customer = await this.userRepository.findOne({
      where: { id: customerId },
    });
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['seller'],
    });

    if (!customer || !product) throw new BadRequestException('Not found');

    let item = await this.cartRepo.findOne({ where: { customer, product } });
    if (item) {
      item.quantity += 1;
    } else {
      item = this.cartRepo.create({ customer, product });
    }
    return await this.cartRepo.save(item);
  }

  async getCart(customerId: number) {
    const customer = await this.userRepository.findOne({
      where: { id: customerId },

      relations: ['cartItems', 'cartItems.product'],
    });

    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    return customer.cartItems;
  }

  // Place order
  async placeOrder(customerId: number, paymentMethod: string) {
    // GET CUSTOMER WITH CART
    const customer = await this.userRepository.findOne({
      where: { id: customerId },

      relations: ['cartItems', 'cartItems.product', 'cartItems.product.seller'],
    });

    // CHECK CART
    if (!customer || customer.cartItems.length === 0) {
      throw new BadRequestException('Cart empty');
    }

    // VALID PAYMENT METHODS
    const validMethods = ['cash', 'card', 'bkash', 'nagad'];

    // CHECK PAYMENT METHOD
    if (!validMethods.includes(paymentMethod)) {
      throw new BadRequestException('Invalid payment method');
    }

    // CALCULATE TOTAL
    let total = 0;

    for (const item of customer.cartItems) {
      total += Number(item.product.price) * Number(item.quantity);
    }

    // CREATE ORDER
    const order = this.orderRepo.create({
      customer,

      paymentMethod,

      status: 'pending',

      totalAmount: total,
    });

    // CREATE ORDER ITEMS
    order.orderItems = customer.cartItems.map((item) =>
      this.orderItemRepo.create({
        product: item.product,

        quantity: item.quantity,

        seller: item.product.seller,

        price: item.product.price,
      }),
    );

    // SAVE ORDER
    await this.orderRepo.save(order);

    // CLEAR CART
    await this.cartRepo.delete({
      customer,
    });

    // RETURN ORDER
    return {
      message: 'Order placed successfully',

      order,
    };
  }

  async getMyOrders(customerId: number) {
    const orders = await this.orderRepo.find({
      where: {
        customer: {
          id: customerId,
        },
      },

      relations: ['orderItems', 'orderItems.product'],

      order: {
        createdAt: 'DESC',
      },
    });

    return orders;
  }

  // Get orders with products + seller
  async getOrderDetails() {
    return await this.orderRepo.find({
      relations: [
        'customer',
        'orderItems',
        'orderItems.product',
        'orderItems.seller',
        'rider',
      ],
    });
  }
  ////cart remove item
  async removeCartItem(id: number) {
    const item = await this.cartRepo.findOne({ where: { id } });
    if (!item) throw new BadRequestException('Cart item not found');
    return await this.cartRepo.remove(item);
  }

  //// Update cart quantity
  async updateCartQuantity(id: number, quantity: number) {
    const item = await this.cartRepo.findOne({
      where: { id },
    });

    if (!item) {
      throw new BadRequestException('Cart item not found');
    }

    item.quantity = quantity;

    await this.cartRepo.save(item);

    return {
      message: 'Quantity updated',
    };
  }

  // Update order status
  async updateOrderStatus(orderId: number, status: string) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new BadRequestException('Order not found');

    const validStatus = ['pending', 'processing', 'delivered', 'cancelled'];
    if (!validStatus.includes(status))
      throw new BadRequestException('Invalid status');

    order.status = status;
    return await this.orderRepo.save(order);
  }
}
