import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from './prisma/prisma.service.js';


export interface SupportMessage {
  id: string;
  customerId: number;
  message: string;
  createdAt: string;
}


@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService ) {}

  getHello(): string {
    return 'Hello World!';
  }

  getUsers(): string[] {  
  return ['vivek','suttu'];
}

async addMessage(message: string) {
  return this.prisma.supportMessage.create({
    data: {
      businessId: "YOUR_EXISTING_BUSINESS_ID",
      sessionId: "demo-session-001",
      message: message,
      sender: "SHOPPER",
    },
  });
}

async getMessages() {
  return this.prisma.supportMessage.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}

}




