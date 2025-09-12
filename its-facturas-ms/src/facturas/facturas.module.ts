import { Module } from '@nestjs/common';
import { FacturaService } from './facturas.service';
import { FacturaController } from './facturas.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FacturaController],
  providers: [FacturaService],
})
export class FacturasModule {}
