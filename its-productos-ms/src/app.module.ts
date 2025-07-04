import { Module } from '@nestjs/common';
import { ProductosModule } from './productos/productos.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ProductosModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
