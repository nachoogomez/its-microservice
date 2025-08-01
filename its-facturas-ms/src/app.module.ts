import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FacturasModule } from './facturas/facturas.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [FacturasModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
