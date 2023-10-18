import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class NewPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  secretCode: string;

  @MinLength(4)
  @MaxLength(12)
  password: string;
}
