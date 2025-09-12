import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  HttpException,
  UseGuards,
  Req,
  Param,
  Delete,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { RpcResponse } from '../common/interfaces/rpc-response.interface';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('facturas')
export class FacturaController {
  constructor(
    @Inject('MS_FACTURA') private readonly facturaClient: ClientProxy,
    @Inject('MS_USER') private readonly userClient: ClientProxy,
    @Inject('MS_PRODUCTOS') private readonly productosClient: ClientProxy,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAllFacturas(@Req() req) {
    try {
      const facturas: any[] = await firstValueFrom(
        this.facturaClient.send({ facturas: 'findAll' }, {}),
      );

      const userIds = [...new Set(facturas.map((f) => f.cliente))];

      const usuarios: Record<string, any> = {};

      for (const id of userIds) {
        const usuario = await firstValueFrom(
          this.userClient.send('findOneUser', { id: parseInt(id, 10) }),
        );
        usuarios[id] = usuario;
      }

      const facturasConUsuario = facturas.map((f) => ({
        ...f,
        usuario: usuarios[f.cliente] || null,
      }));

      return facturasConUsuario;
    } catch (error) {
      const { statusCode = 500, error: mensaje } = error as RpcResponse;
      throw new HttpException(mensaje ?? error, statusCode);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async crearFactura(@Req() req, @Body() dto: CreateFacturaDto) {
    console.log('🔍 FacturaController.crearFactura() called');
    console.log('📝 Request body:', dto);
    console.log('👤 Request user:', req.user);
    
    try {
      // Validar que el usuario existe antes de crear la factura
      const userId = req.user?.sub || req.user?.userId;
      console.log('🆔 Extracted userId:', userId);
      
      if (!userId) {
        console.log('❌ No userId found in request');
        throw new HttpException('Usuario no autenticado', 401);
      }

      // Verificar que el usuario existe en el sistema
      try {
        await firstValueFrom(
          this.userClient.send('findOneUser', { id: parseInt(String(userId), 10) }),
        );
      } catch (userError) {
        throw new HttpException('Usuario no encontrado en el sistema', 404);
      }

      // Validar que los productos existen y tienen stock
      for (const item of dto.items) {
        try {
          // Aquí deberías validar con el microservicio de productos
          // const producto = await firstValueFrom(
          //   this.productosClient.send('findOneProduct', { id: item.productId }),
          // );
          console.log(`Validando producto: ${item.descripcion}`);
        } catch (productError) {
          throw new HttpException(`Producto no encontrado: ${item.descripcion}`, 404);
        }
      }

      const facturaCompleta = {
        ...dto,
        cliente: String(userId), // Convertir a string
      };

      const factura = await firstValueFrom(
        this.facturaClient.send({ facturas: 'create' }, facturaCompleta),
      );

      return {
        ...factura,
        message: 'Factura creada exitosamente',
      };
    } catch (error) {
      const { statusCode = 500, error: mensaje } = error as RpcResponse;
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        mensaje ?? 'Error interno del servidor al crear la factura',
        statusCode,
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findFacturaById(@Param('id') id: string) {
    const factura = await firstValueFrom(
      this.facturaClient.send({ facturas: 'find-by-id' }, id),
    );

    const usuario = await firstValueFrom(
      this.userClient.send('findOneUser', { id: parseInt(factura.cliente, 10) }),
    );

    return { ...factura, usuario };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async eliminarFactura(@Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.facturaClient.send({ facturas: 'remove' }, id),
      );
    } catch (error) {
      const { statusCode = 500, error: msg } = error as RpcResponse;
      throw new HttpException(msg ?? error, statusCode);
    }
  }
}
