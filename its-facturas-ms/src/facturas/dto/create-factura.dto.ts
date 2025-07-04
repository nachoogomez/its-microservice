import { IsNumber, IsString, IsOptional, Min, MaxLength } from 'class-validator';

export class CreateFacturaDto {
  @IsNumber()
  @Min(0)
  monto: number;

  @IsString()
  @MaxLength(255)
  descripcion: string;

  @IsOptional()
  @IsString()
  cliente?: string;
}