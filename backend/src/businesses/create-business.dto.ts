
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
