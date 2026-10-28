import { RegisterCustomerDto } from './dto/register-customer.dto.js';
import { Body, Controller, Post } from '@nestjs/common';
import { Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CustomersService } from './customers.service.js';
import { LoginCustomerDto } from './dto/login-customer.dto.js';

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
login(@Body() body: LoginCustomerDto) {
  return this.customersService.login(body);
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
