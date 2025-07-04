import { Controller, Get, Post, Body, Inject, HttpException, UseGuards, Req, Param, Delete } from '@nestjs/common';
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
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAllFacturas(@Req() req) {
    try {
      const facturas: any[] = await firstValueFrom(
        this.facturaClient.send({ facturas: 'findAll' }, {}),
      );

      const userIds = [...new Set(facturas.map(f => f.cliente))];

      const usuarios: Record<string, any> = {};

      for (const id of userIds) {
        const usuario = await firstValueFrom(
          this.userClient.send({ users: 'find-by-id' }, id),
        );
        usuarios[id] = usuario;
      }

      const facturasConUsuario = facturas.map(f => ({
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
    const facturaCompleta = {
      ...dto,
      cliente: req.user.sub,
    };

    return await firstValueFrom(
      this.facturaClient.send({ facturas: 'create' }, facturaCompleta),
    );
  }

  @Get(':id')
  async findFacturaById(@Param('id') id: string) {
    const factura = await firstValueFrom(
      this.facturaClient.send({ facturas: 'find-by-id' }, id),
    );

    const usuario = await firstValueFrom(
      this.userClient.send({ users: 'find-by-id' }, factura.cliente),
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