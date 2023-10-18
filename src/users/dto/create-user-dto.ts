import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(12)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
