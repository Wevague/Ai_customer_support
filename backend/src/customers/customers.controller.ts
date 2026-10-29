import { RegisterCustomerDto } from './dto/register-customer.dto.js';
import { Body, Controller, Post ,Res} from '@nestjs/common';
import { Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CustomersService } from './customers.service.js';
import { LoginCustomerDto } from './dto/login-customer.dto.js';
import type { Response } from 'express';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
  ) {}

@Post('register')
register(@Body() body: RegisterCustomerDto) {
  return this.customersService.register(body);
}

@Post('login')
async login(
  @Body() body: LoginCustomerDto,
  @Res({ passthrough: true }) response: Response,
) {
  const result = await this.customersService.login(body);

  response.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 1000,
  });

  return { message: result.message };
}

@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(
  @Req()
  req: { user: { customerId: string; email: string } },
) {

  return  this.customersService.getProfile(req.user.customerId)
    
 
}


}
