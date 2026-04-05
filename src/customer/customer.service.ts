import { CreateCustomerDto, UpdateProfileDto } from './customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { customerEntity } from './customer.entity';
import { Like, Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductEntity } from 'src/seller/product.entity';
import { CartItem } from './cart-item.entity';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';

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
  ) {}
  async createUser(dto: CreateCustomerDto): Promise<customerEntity> {
    return await this.userRepository.save(dto);
  }
  async login(body): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        email: body.email,
      },
    });
    if (!user || user.password !== body.password) {
      throw new BadRequestException('Invalid email or password');
    }

    return user;
  }
  async getProfile(id: number): Promise<customerEntity> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException(`User not found with id ${id}`);
    }

    return user;
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

    return await this.userRepository.save(user);
  }
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

  // Place order
  async placeOrder(customerId: number, paymentMethod: string) {
    const customer = await this.userRepository.findOne({
      where: { id: customerId },
      relations: ['cartItems', 'cartItems.product', 'cartItems.product.seller'],
    });

    if (!customer || customer.cartItems.length === 0)
      throw new BadRequestException('Cart empty');

    const validMethods = ['cash', 'card', 'bkash', 'nagad'];
    if (!validMethods.includes(paymentMethod))
      throw new BadRequestException('Invalid payment method');

    const order = this.orderRepo.create({
      customer,
      paymentMethod,
      status: 'pending',
    });

    order.orderItems = customer.cartItems.map((item) =>
      this.orderItemRepo.create({
        product: item.product,
        quantity: item.quantity,
        seller: item.product.seller,
      }),
    );

    await this.orderRepo.save(order);

    await this.cartRepo.delete({ customer });

    return order;
  }

  // Get orders with products + seller
  async getOrderDetails() {
    return await this.orderRepo.find({
      relations: [
        'customer',
        'orderItems',
        'orderItems.product',
        'orderItems.seller',
      ],
    });
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
