import { Type } from 'class-transformer';
import {
  IsOptional,
  IsPositive,
  IsString,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';

export class PaginationDto {
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}

export class FindProductsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string; // Búsqueda por nombre

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  inStock?: boolean; // Solo productos con stock > 0

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean = true; // Por defecto solo productos activos
}
