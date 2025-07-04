import { Type } from "class-transformer";
import { IsNumber, IsString, Min, IsNotEmpty } from "class-validator";

export class CreateProductoDto {

    @IsString()
    nombre: string;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    precio: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    stock: number;
}
