import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFacturaDto } from './dto/create-factura.dto';

@Injectable()
export class FacturaService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateFacturaDto) {
    return this.prisma.factura.create({ data });
  }

  findAll() {
    return this.prisma.factura.findMany();
  }

  findOne(id: string) {
    return this.prisma.factura.findUnique({ where: { id } });
  }

  remove(id: string) {
    return this.prisma.factura.delete({ where: { id } });
  }
}