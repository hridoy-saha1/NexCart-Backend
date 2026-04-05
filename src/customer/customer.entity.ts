import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity('customerTable')
export class customerEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
