import { Type } from "class-transformer";
import { IsNumber, IsString, Min, IsNotEmpty, MaxLength, MinLength, IsDecimal, Max } from "class-validator";

export class CreateProductoDto {

    @IsString({ message: 'El nombre debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
    nombre: string;

    @IsNumber({}, { message: 'El precio debe ser un número' })
    @Min(0, { message: 'El precio no puede ser negativo' })
    @Max(999999.99, { message: 'El precio no puede exceder 999,999.99' })
    @Type(() => Number)
    precio: number;

    @IsNotEmpty({ message: 'El stock es requerido' })
    @IsNumber({}, { message: 'El stock debe ser un número entero' })
    @Min(0, { message: 'El stock no puede ser negativo' })
    @Max(999999, { message: 'El stock no puede exceder 999,999 unidades' })
    @Type(() => Number)
    stock: number;
}
