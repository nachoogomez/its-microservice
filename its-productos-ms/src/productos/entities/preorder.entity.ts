import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Product } from './producto.entity';

@Entity('preorders')
export class PreOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.preOrders, { eager: true })
  product: Product;

  @Column()
  userId: number; 

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}