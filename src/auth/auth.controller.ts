import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateCodeDto } from './dto/generate-code-dto';
import { LoginAuthDto } from './dto/login-auth-dto';
import { NewPasswordDto } from './dto/new-password-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login') //Devuelve usuario y JWT
  loginUser(@Body() userLogin: LoginAuthDto) {
    return this.authService.login(userLogin);
  }

  @Post('generateCode') //Genera codigo para cambio de password
  generateCode(@Body() userCode: GenerateCodeDto) {
    return this.authService.generateCode(userCode);
  }

  @Post('passwordChange') //Cambia password
  passwordChange(@Body() newPassword: NewPasswordDto) {
    return this.authService.newPassword(newPassword);
  }
}
