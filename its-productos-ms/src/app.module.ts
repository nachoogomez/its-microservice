import { Module } from '@nestjs/common';
import { ProductosModule } from './productos/productos.module';
import { PreOrdersModule } from './preorders/preorders.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [ProductosModule, PreOrdersModule, DatabaseModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
