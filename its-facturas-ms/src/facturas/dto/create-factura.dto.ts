import { 
  IsNumber, 
  IsString, 
  IsDate, 
  IsArray, 
  ValidateNested, 
  ArrayMinSize,
  IsPositive,
  Min,
  IsInt
} from 'class-validator';
import { Type } from 'class-transformer';

export class FacturaItemDto {
  @IsString()
  descripcion: string;

  @IsNumber()
  @IsPositive()
  cantidad: number;

  @IsNumber()
  @IsPositive()
  precio: number;
}

export class CreateFacturaDto {
  @IsNumber()
  @IsInt()
  @Min(1)
  numero: number;

  @IsDate()
  @Type(() => Date)
  fecha: Date;

  @IsString()
  cliente: string;

  @IsNumber()
  @IsPositive()
  total: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => FacturaItemDto)
  items: FacturaItemDto[];
}