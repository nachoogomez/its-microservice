import { IsInt, Min, IsPositive } from 'class-validator';

export class CreatePreOrderDto {
  @IsInt()
  productId: number;

  @IsInt()
  userId: number;

  @IsPositive()
  @Min(1)
  quantity: number;
}