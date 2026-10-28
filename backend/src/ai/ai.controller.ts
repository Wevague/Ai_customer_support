
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AiService } from './ai.service.js';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('test')
  async testAI(@Body('message') message: string) {
    if (!message || !message.trim()) {
      throw new BadRequestException('Message cannot be empty');
    }

    const reply = await this.aiService.generateReply(message);

    return {
      message,
      reply,
    };
  }
}
