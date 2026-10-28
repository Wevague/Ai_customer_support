
import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { BusinessesService } from './businesses.service.js';
import { CreateBusinessDto } from './create-business.dto.js';


@Controller('businesses')
@UseGuards(JwtAuthGuard)
export class BusinessesController {
  constructor(
    private readonly businessesService: BusinessesService,
  ) {}

 @Post()
create(
  @Body() body: CreateBusinessDto,
  @Req() req: { user: { customerId: string } },
) {
  return this.businessesService.create(
    body.name,
    req.user.customerId,
  );
}

  @Get('me')
  getMyBusiness(
    @Req() req: { user: { customerId: string } },
  ) {
    return this.businessesService.getMyBusiness(
      req.user.customerId,
    );
  }
}
