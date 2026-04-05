import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { OneToMany } from 'typeorm';
import { Review } from './review.entity';

@Entity()
export class Rider {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['available', 'busy', 'offline'],
    default: 'offline',
  })
  status: string;

  @Column({ nullable: true })
  vehicle_type: string;

  @Column({ nullable: true })
  current_location: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => Review, (review) => review.rider)
  reviews: Review[];
}