
import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller.js';
import { MessagesService } from './messages.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AiModule } from '../ai/ai.module.js';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
