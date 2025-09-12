import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFacturaDto } from './dto/create-factura.dto';

@Injectable()
export class FacturaService {
  private readonly logger = new Logger(FacturaService.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateFacturaDto) {
    this.logger.log(`Iniciando creación de factura para cliente: ${data.cliente}`);
    
    try {
      const { items, ...facturaData } = data;
      
      // Validar que el número de factura no exista
      const facturaExistente = await this.prisma.factura.findFirst({
        where: { numero: facturaData.numero },
      });

      if (facturaExistente) {
        this.logger.warn(`Intento de crear factura con número duplicado: ${facturaData.numero}`);
        throw new BadRequestException(`Ya existe una factura con el número ${facturaData.numero}`);
      }

      // Usar transacción para crear factura y items
      const result = await this.prisma.$transaction(async (tx) => {
        // Crear la factura
        const factura = await tx.factura.create({
          data: {
            ...facturaData,
            items: {
              create: items,
            },
          },
          include: {
            items: true,
          },
        });

        this.logger.log(`Factura creada exitosamente con ID: ${factura.id}`);
        return factura;
      });

      return result;
    } catch (error) {
      this.logger.error(`Error al crear factura: ${error.message}`, error.stack);
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new BadRequestException('Error al crear la factura: ' + error.message);
    }
  }

  async findAll() {
    try {
      return await this.prisma.factura.findMany({
        include: {
          items: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener las facturas: ' + error.message);
    }
  }

  async findOne(id: string) {
    try {
      const factura = await this.prisma.factura.findUnique({
        where: { id },
        include: {
          items: true,
        },
      });

      if (!factura) {
        throw new NotFoundException(`Factura con ID ${id} no encontrada`);
      }

      return factura;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener la factura: ' + error.message);
    }
  }

  async remove(id: string) {
    try {
      // Verificar que la factura existe antes de eliminar
      const facturaExistente = await this.prisma.factura.findUnique({
        where: { id },
      });

      if (!facturaExistente) {
        throw new NotFoundException(`Factura con ID ${id} no encontrada`);
      }

      return await this.prisma.factura.delete({
        where: { id },
        include: {
          items: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar la factura: ' + error.message);
    }
  }
}