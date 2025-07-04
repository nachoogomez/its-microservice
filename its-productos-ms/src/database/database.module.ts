import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { envs } from "../config/envs";
import { Product } from "src/productos/entities/producto.entity";
import { PreOrder } from "src/productos/entities/preorder.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: envs.DB_HOST,
      port: envs.DB_PORT,
      username: envs.DB_USERNAME,
      password: envs.DB_PASSWORD,
      database: envs.DB_NAME,
      entities: [Product, PreOrder],
      synchronize: true, 
    }),
  ],
})
export class DatabaseModule {}