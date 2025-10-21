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
      const { items, usuarioId, ...facturaData } = data;

      this.logger.log(`Usuario ID recibido: ${usuarioId}, Cliente: ${data.cliente}`);

      const facturaExistente = await this.prisma.factura.findFirst({
        where: { numero: facturaData.numero },
      });

      if (facturaExistente) {
        this.logger.warn(`Intento de crear factura con número duplicado: ${facturaData.numero}`);
        throw new BadRequestException(`Ya existe una factura con el número ${facturaData.numero}`);
      }

      const result = await this.prisma.$transaction(async (tx) => {
        const factura = await tx.factura.create({
          data: {
            numero: facturaData.numero,
            fecha: facturaData.fecha,
            cliente: facturaData.cliente,
            total: facturaData.total,
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
      const facturaExistente = await this.prisma.factura.findUnique({
        where: { id },
        include: {
          items: true,
        },
      });

      if (!facturaExistente) {
        throw new NotFoundException(`Factura con ID ${id} no encontrada`);
      }

      this.logger.log(`Eliminando factura con ID: ${id}`);

      return await this.prisma.$transaction(async (tx) => {
        await tx.facturaItem.deleteMany({
          where: { facturaId: id },
        });

        this.logger.log(`Items eliminados para factura ${id}`);

        const factura = await tx.factura.delete({
          where: { id },
        });

        this.logger.log(`Factura ${id} eliminada exitosamente`);

        return factura;
      });
    } catch (error) {
      this.logger.error(`Error al eliminar factura ${id}: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar la factura: ' + error.message);
    }
  }
}