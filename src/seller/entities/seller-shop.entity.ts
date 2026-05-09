import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { SellerEntity } from './seller.entity';
import { ProductEntity } from './product.entity';

@Entity('seller_shop')
export class SellerShopEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  shopName: string;

  @Column({ type: 'varchar', length: 255 })
  shopAddress: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  tradeLicense: string;

  @OneToOne(() => SellerEntity, (seller) => seller.shop, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  seller: SellerEntity;

  @OneToMany(() => ProductEntity, (product) => product.sellerShop)
  products: ProductEntity[];
}