import { Injectable, Logger } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/producto.entity';
import { Repository, Like, Between, MoreThan } from 'typeorm';
import { rpcError } from './helpers/rpc.helpers';
import { PaginationDto, PaginatedResponse } from 'src/common';
import { validateDto, validateId } from '../common/helpers/validation.helper';
import { FindProductsDto } from './dto/find-products.dto';

@Injectable()
export class ProductosService {
  private readonly logger = new Logger(ProductosService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productoRepository: Repository<Product>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Product> {
    try {
      const product = this.productoRepository.create(createProductoDto);
      return this.productoRepository.save(product);
    } catch (error) {
      throw rpcError('error creating product ' + error.message);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResponse<Product>> {
    try {
      const { page = 1, limit = 10 } = paginationDto;
      
      if (page < 1) {
        throw rpcError('Page number must be greater than 0', 400);
      }
      
      if (limit < 1 || limit > 100) {
        throw rpcError('Limit must be between 1 and 100', 400);
      }

      const offset = (page - 1) * limit;

      const [products, total] = await this.productoRepository.findAndCount({
        skip: offset,
        take: limit,
        order: { createdAt: 'DESC' }
      });

      // Calcular total de páginas
      const totalPages = Math.ceil(total / limit);

      return {
        data: products,
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      throw rpcError('error finding all products ' + error.message);
    }
  }

  async findAllNoPagination(): Promise<Product[]> {
    try {
      return await this.productoRepository.find({
        where: { isActive: true },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw rpcError('error finding all products ' + error.message);
    }
  }

  async searchProducts(findProductsDto: FindProductsDto): Promise<PaginatedResponse<Product>> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        minPrice,
        maxPrice,
        inStock,
        isActive
      } = findProductsDto;

      if (page < 1) {
        throw rpcError('Page number must be greater than 0', 400);
      }

      if (limit < 1 || limit > 100) {
        throw rpcError('Limit must be between 1 and 100', 400);
      }

      const offset = (page - 1) * limit;
      const whereConditions: any = {};

      // Solo agregar filtro isActive si se proporciona explícitamente
      if (isActive !== undefined) {
        whereConditions.isActive = isActive;
      }

      if (search) {
        whereConditions.nombre = Like(`%${search}%`);
      }

      if (minPrice !== undefined && maxPrice !== undefined) {
        whereConditions.precio = Between(minPrice, maxPrice);
      } else if (minPrice !== undefined) {
        whereConditions.precio = MoreThan(minPrice);
      } else if (maxPrice !== undefined) {
        whereConditions.precio = Between(0, maxPrice);
      }

      if (inStock === true) {
        whereConditions.stock = MoreThan(0);
      }

      const [products, total] = await this.productoRepository.findAndCount({
        where: whereConditions,
        skip: offset,
        take: limit,
        order: { createdAt: 'DESC' }
      });

      const totalPages = Math.ceil(total / limit);

      return {
        data: products,
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      throw rpcError('error searching products ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const validatedId = validateId(id, 'Product ID');
      
      const product = await this.productoRepository.findOne({ where: { id: validatedId } });
      if (!product) {
        throw rpcError('Product not found', 404);
      }
      return product;
    } catch (error) {
      throw rpcError('error finding product ' + error.message);
    }
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    try {
      const validatedId = validateId(id, 'Product ID');
      
      const product = await this.productoRepository.findOne({ where: { id: validatedId } });
      if (!product) {
        throw rpcError('Product not found', 404);
      }
      Object.assign(product, updateProductoDto);
      return this.productoRepository.save(product);
    } catch (error) {
      throw rpcError('error updating product ' + error.message);
    }
  }

  async remove(id: number) {
    try {
      const validatedId = validateId(id, 'Product ID');
      
      const product = await this.productoRepository.findOne({ where: { id: validatedId } });
      if (!product) {
        throw rpcError('Product not found', 404);
      }
     return await this.productoRepository.remove(product);
    } catch (error) {
      throw rpcError(`Error al eliminar el producto: ${error.message}`);
    }
  }
}
