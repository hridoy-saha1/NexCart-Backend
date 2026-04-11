import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Rider } from '../rider/rider.entity';

@Entity()
export class Review {

  @PrimaryGeneratedColumn()
  id: number;

  //Rating (1 to 5)
  @Column({
    type: 'int',
  })
  rating: number;

  // 💬 Comment
  @Column({
    type: 'text',
    nullable: true,
  })
  comment: string;

  // 🔗 Many Reviews → One Rider
  @ManyToOne(() => Rider, (rider) => rider.reviews, {
    onDelete: 'CASCADE',
  })
  rider: Rider;

  // 🕒 Created Time
  @CreateDateColumn()
  created_at: Date;
  
}