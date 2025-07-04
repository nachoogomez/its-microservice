import { IsInt, IsPositive } from 'class-validator';

export class CartAddDto {
  @IsInt()
  productId: number;

  @IsPositive()
  quantity: number;
}
