import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { FacturasModule } from './facturas/facturas.module';
import { PreOrdersModule } from './preorders/preorders.module';

@Module({
  imports: [
    ProductsModule,
    UsersModule,
    CartModule,
    AuthModule,
    FacturasModule,
    PreOrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
