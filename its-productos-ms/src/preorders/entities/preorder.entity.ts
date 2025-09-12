import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';

@Entity('preorders')
export class PreOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('Product', 'preOrders', { eager: true })
  product: any;

  @Column()
  userId: number; 

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
