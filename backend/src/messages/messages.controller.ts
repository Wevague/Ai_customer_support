import { Controller,Body,Patch,Post,Get,UseGuards,Req,BadRequestException,Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { MessagesService } from './messages.service.js';
import { get } from 'node:http';
import type { Request } from 'express';
import { CreateMessageDto } from './create-message.dto.js';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
    constructor(private readonly messageService: MessagesService) {}

   

@Post()
async addMessage(
  @Body() body: CreateMessageDto,
  @Req() req: { user: { customerId: string } },
) {
  return this.messageService.addMessage(
    body.message.trim(),
    req.user.customerId,
    body.sessionId,
  );
}


@Get()
async getMessage(
    @Req() req:{user: {customerId: string}},
){
    return this.messageService.getMessage(req.user.customerId);
}


@Get('conversations')
async getConversations(
  @Req() req: { user: { customerId: string } },
) {
    console.log('Logged-in user:', req.user);
  return this.messageService.getConversations(
    req.user.customerId,
  );
}


@Get('conversation-statuses')
async getConversationStatuses(@Req() req: Request) {
  const user = req.user as { customerId: string };

 return this.messageService.getConversationStatuses(
  user.customerId,
);
}


@Get(':sessionId')
async getMessagesBySession(
  @Req() req: { user: { customerId: string } },
  @Param('sessionId') sessionId: string,
) {
  return this.messageService.getMessagesBySession(
    req.user.customerId,
    sessionId,
  );
}



@Patch('conversations/:sessionId/status')
async updateConversationStatus(
  @Req() req: Request,
  @Param('sessionId') sessionId: string,
  @Body('status') status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED',
) {
  const user = req.user as { customerId: string };

  const allowedStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];

  if (!allowedStatuses.includes(status)) {
    throw new BadRequestException(
      'Status must be OPEN, IN_PROGRESS, or RESOLVED',
    );
  }

  return this.messageService.updateConversationStatus(
    user.customerId,
    sessionId,
    status,
  );
}

@Patch('conversations/:sessionId/handoff')
async requestHumanHandoff(
  @Req() req: Request,
  @Param('sessionId') sessionId: string,
) {
  const user = req.user as { customerId: string };

  return this.messageService.requestHumanHandoff(
    user.customerId,
    sessionId,
  );
}


}
