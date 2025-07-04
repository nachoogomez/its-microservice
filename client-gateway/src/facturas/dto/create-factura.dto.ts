import { IsDate, IsInt, IsNumber, IsPositive, IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class FacturaItemDto {
  @IsString()
  descripcion: string;

  
  @IsInt()
  @IsPositive()
  cantidad: number;

  
  @IsNumber()
  @IsPositive()
  precio: number;
}

export class CreateFacturaDto {
  @IsInt()
  numero: number;

  @IsDate()
  @Type(() => Date) // para que transforme el string a Date automáticamente
  fecha: Date;

  @IsString()
  cliente: string;

  
  @IsNumber()
  @IsPositive()
  total: number;

  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => FacturaItemDto)
  items: FacturaItemDto[];
}
