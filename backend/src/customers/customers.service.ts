
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CustomersService {
 constructor(
  private readonly prisma: PrismaService,
  private readonly jwtService: JwtService,
) {}

  async register(data: {
    fullName: string;
    email?: string;
    phone?: string;
    password: string;
  }) {
    const fullName = data.fullName?.trim();
    const email = data.email?.trim().toLowerCase() || undefined;
    const phone = data.phone?.trim() || undefined;
    const password = data.password;

    if (!fullName || !password) {
      throw new BadRequestException(
        'Full name and password are required',
      );
    }

    if (!email && !phone) {
      throw new BadRequestException(
        'Provide an email address or phone number',
      );
    }

    if (password.length < 8) {
      throw new BadRequestException(
        'Password must contain at least 8 characters',
      );
    }

    const existingCustomer = await this.prisma.customer.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    if (existingCustomer) {
      throw new ConflictException(
        'Email or phone number is already registered',
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const customer = await this.prisma.customer.create({
      data: {
        fullName,
        email: email ?? null,
        phone: phone ?? null,
        passwordHash,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    return {
      message: 'Customer registered successfully',
      customer,
    };
  }
  
async login(data: {
  identifier : string;
  password: string;
}) {
  const identifier  = data.identifier ?.trim().toLowerCase();
  const password = data.password;

  if (!identifier  || !password) {
    throw new BadRequestException(
      'Email/phone  and password are required',
    );
  }

    const customer = await this.prisma.customer.findFirst({
    where: {
      OR: [
        { email: identifier.toLowerCase() },
        { phone: identifier },
      ],
    },
  });
  if (!customer) {
    throw new UnauthorizedException(
      'Invalid email or password',
    );
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    customer.passwordHash,
  );

  if (!isPasswordValid) {
    throw new UnauthorizedException(
      'Invalid email or password',
    );
  }

  const accessToken = await this.jwtService.signAsync({
    sub: customer.id,
    email: customer.email,
  });

  return {
    message: 'Login successful',
    accessToken,
  };
}

async getProfile(customerId:string){

  const customerDetails = await this.prisma.customer.findUnique({
    where:{
      id:customerId,
    },
  })
  return customerDetails;
}


}
