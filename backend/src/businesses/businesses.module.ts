import { Module } from '@nestjs/common';
import { BusinessesService } from './businesses.service.js';
import { BusinessesController } from './businesses.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports :[PrismaModule],
  providers: [BusinessesService],
  controllers: [BusinessesController]
})
export class BusinessesModule {}
