import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  async getAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo producto' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        price: { type: 'number' },
        image: { type: 'string' },
      },
    },
  })
  async create(@Body() data: Product): Promise<Product> {
    return this.productsService.create(data);
  }
}
