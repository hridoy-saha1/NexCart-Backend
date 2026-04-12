import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { SellerShopEntity } from './seller-shop.entity';

@Entity('seller')
export class SellerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nidNumber: string;

  @Column({ type: 'varchar', length: 255 })
  nidImage: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @OneToMany(() => ProductEntity, (product) => product.seller)
  products: ProductEntity[];

  @OneToOne(() => SellerShopEntity, (shop) => shop.seller)
  shop: SellerShopEntity;
  }
