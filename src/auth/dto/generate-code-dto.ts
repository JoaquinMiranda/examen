import { IsEmail, IsNotEmpty } from 'class-validator';

export class GenerateCodeDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
