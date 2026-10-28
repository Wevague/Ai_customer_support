
import {
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class BusinessesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: string, ownerId: string) {
    const existingBusiness = await this.prisma.business.findUnique({
      where: { ownerId },
    });

    if (existingBusiness) {
      throw new ConflictException(
        'You already have a business',
      );
    }

    return this.prisma.business.create({
      data: {
        name,
        ownerId,
      },
    });
  }

  async getMyBusiness(ownerId: string) {
    return this.prisma.business.findUnique({
      where: { ownerId },
    });
  }
}
