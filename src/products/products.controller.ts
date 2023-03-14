import { Body, Controller, Get, Post } from '@nestjs/common';

import { CreateProductDTO } from './dto/CreateProduct.dto';
import { ProductsRepository } from './products.repository';

@Controller('/products')
export class ProductsController {
  constructor(private productsRepository: ProductsRepository) {}

  @Post()
  async createProduct(@Body() productData: CreateProductDTO) {
    this.productsRepository.save(productData);
    return productData;
  }

  @Get()
  async listProducts() {
    return this.productsRepository.listProducts();
  }
}
