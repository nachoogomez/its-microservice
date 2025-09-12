import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller()
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  @MessagePattern('health-check')
  async check() {
    return this.healthCheckService.check([
      // Verificar conexión a base de datos
      () => this.typeOrmHealthIndicator.pingCheck('database', { connection: this.dataSource }),
    ]);
  }

  @MessagePattern('health-check-simple')
  async simpleCheck() {
    return {
      status: 'ok',
      service: 'products-microservice',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
