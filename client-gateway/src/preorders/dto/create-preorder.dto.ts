import { IsInt, Min, IsPositive } from 'class-validator';

export class CreatePreOrderDto {
  @IsInt()
  @IsPositive()
  productId: number;

  @IsInt()
  @IsPositive()
  userId: number;

  @IsPositive()
  @Min(1)
  quantity: number;
}
