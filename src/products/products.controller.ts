import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.BusinessOwner, UserRole.Admin)
@Controller('business/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar productos del negocio autenticado' })
  async getAll(@Req() request: AuthenticatedRequest): Promise<Product[]> {
    return this.productsService.findByOwner(request.user._id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear producto del negocio autenticado' })
  async create(
    @Req() request: AuthenticatedRequest,
    @Body() data: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.createForOwner(request.user._id, data);
  }

  @Patch(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: UpdateProductDto,
  ) {
    return this.productsService.updateForOwner(request.user._id, id, data);
  }

  @Delete(':id')
  delete(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.productsService.deleteForOwner(request.user._id, id);
  }
}
