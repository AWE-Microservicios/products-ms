import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '@prisma/prisma.service';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({ data: createProductDto });
  }

  async findAll(paginationDto: PaginationDto) {

    const { page = 1, limit = 10 } = paginationDto;
    const items = await this.prisma.product.count({ where: { available: true } });
    const lastPage = Math.ceil(items / limit);
    const message = `Page ${page} exceeds of ${lastPage} no more data here `;

    if (page > lastPage) {
      throw new NotFoundException(message);
    }

    return {
      data: await this.prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true },
      }),
      pagination: {
        Items: items,
        page,
        limit,
        lastPage,
      }
    };

  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id, available: true } });

    if (!product) {
      throw new NotFoundException(`Product with id #${id} not found`);
    }

    return {
      data: product,
    }

  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    const { id: _, ...updateData } = updateProductDto; // Exclude 'id' from the update data 

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (Object.keys(updateProductDto).length === 0) {
      console.log('No data provided for update');
      throw new NotFoundException('No data provided for update');
    }

    console.log('Updating product with ID:', id, updateProductDto, product);

    return this.prisma.product.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    await this.findOne(id)
    const product = this.prisma.product.update({
      where: { id },
      data: { available: false },
    });
    return product;

    // return this.prisma.product.delete({ where: { id } });
   

  }
}
