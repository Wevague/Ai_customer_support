
import { Controller, Get ,Post,Body,BadRequestException} from '@nestjs/common';
import { AppService,  } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  getUsers(): string[] {
    return this.appService.getUsers();
  }

  
  }
 

