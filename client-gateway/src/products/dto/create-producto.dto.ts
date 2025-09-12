import { Type } from 'class-transformer';
import { IsNumber, IsString, Min, IsNotEmpty } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  precio: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;
}
