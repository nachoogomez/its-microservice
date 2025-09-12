import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFacturaDto } from './dto/create-factura.dto';

@Injectable()
export class FacturaService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateFacturaDto) {
    try {
      const { items, ...facturaData } = data;
      
      return await this.prisma.factura.create({
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
    } catch (error) {
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