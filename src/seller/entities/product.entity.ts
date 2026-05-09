import { CartItem } from 'src/customer/cart-item.entity';
import { OrderItem } from 'src/customer/order-item.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { SellerEntity } from './seller.entity';
import { SellerShopEntity } from './seller-shop.entity';

export enum ProductCategory {
  ELECTRONICS = 'Electronics',
  FASHION = 'Fashion',
  HOME_LIVING = 'Home & Living',
  BEAUTY = 'Beauty',
  SPORTS = 'Sports',
}

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  productName: string;

  @Column({
    type: 'enum',
    enum: ProductCategory,
  })
  category: ProductCategory;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  productImage: string | null;

  @OneToMany(() => CartItem, (cart) => cart.product)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, (oi) => oi.product)
  orderItems: OrderItem[];

  @ManyToOne(() => SellerEntity, (seller) => seller.products, {
    onDelete: 'CASCADE',
  })
  seller: SellerEntity;

  @ManyToOne(() => SellerShopEntity, (shop) => shop.products, {
    onDelete: 'CASCADE',
  })
  sellerShop: SellerShopEntity;
}