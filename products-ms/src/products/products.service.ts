import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page , limit } = paginationDto;

    const totalPage = await this.product.count();
    const lastPage = Math.ceil(totalPage / limit);

    return{
      data : await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      meta:{
        total: totalPage,
        page: page,
        lastPage: lastPage,
      }
    } 
  }

  findOne(id: number) {
    const product =  this.product.findUnique({
      where: { id },
    });

    if(!product){
      throw new Error(`Product with ID ${id} not found`);
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.product.update({
      where: { id },
      data: updateProductDto
    });
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
