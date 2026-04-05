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
  async addToCart(productId: number) {
    const customer = await this.userRepository.findOne({ where: { id: 1 } });
    const product = await this.productRepository.findOne({
      where: { id: productId },
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

  // ✅ Place Order
  async placeOrder() {
    const customer = await this.userRepository.findOne({
      where: { id: 1 },
      relations: ['cartItems', 'cartItems.product'],
    });

    if (!customer || customer.cartItems.length === 0)
      throw new BadRequestException('Cart empty');

    const order = this.orderRepo.create({ customer });

    order.orderItems = customer.cartItems.map((item) =>
      this.orderItemRepo.create({
        product: item.product,
        quantity: item.quantity,
      }),
    );

    await this.orderRepo.save(order);

    await this.cartRepo.delete({ customer });

    return order;
  }

  // ✅ Get Orders with Products
  async getOrderDetails() {
    return await this.orderRepo.find({
      relations: ['customer', 'orderItems', 'orderItems.product'],
    });
  }
}
