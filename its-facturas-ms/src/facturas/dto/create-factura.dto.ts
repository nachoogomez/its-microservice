import { 
  IsNumber, 
  IsString, 
  IsDate, 
  IsArray, 
  ValidateNested, 
  ArrayMinSize,
  IsPositive,
  Min,
  IsInt,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Type } from 'class-transformer';

@ValidatorConstraint({ name: 'totalMatchesItems', async: false })
export class TotalMatchesItemsConstraint implements ValidatorConstraintInterface {
  validate(total: number, args: ValidationArguments) {
    const object = args.object as any;
    if (!object.items || !Array.isArray(object.items)) {
      return false;
    }
    
    const calculatedTotal = object.items.reduce((sum: number, item: any) => {
      return sum + (item.cantidad * item.precio);
    }, 0);
    
    return Math.abs(total - calculatedTotal) < 0.01; // Tolerancia para decimales
  }

  defaultMessage(args: ValidationArguments) {
    return 'El total debe coincidir con la suma de (cantidad * precio) de todos los items';
  }
}

@ValidatorConstraint({ name: 'notFutureDate', async: false })
export class NotFutureDateConstraint implements ValidatorConstraintInterface {
  validate(fecha: Date) {
    if (!fecha) return false;
    
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Fin del día actual
    
    return fecha <= today;
  }

  defaultMessage() {
    return 'La fecha de la factura no puede ser futura';
  }
}

export class FacturaItemDto {
  @IsString()
  descripcion: string;

  @IsNumber()
  @IsPositive()
  @IsInt()
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
  @Validate(NotFutureDateConstraint)
  fecha: Date;

  @IsString()
  cliente: string;

  @IsNumber()
  @IsPositive()
  @Validate(TotalMatchesItemsConstraint)
  total: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => FacturaItemDto)
  items: FacturaItemDto[];
}