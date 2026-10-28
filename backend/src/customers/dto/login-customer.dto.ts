
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginCustomerDto {
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsString()
  @MinLength(8)
  password: string;
}
