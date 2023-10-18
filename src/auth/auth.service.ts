import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { GenerateCodeDto } from './dto/generate-code-dto';
import { LoginAuthDto } from './dto/login-auth-dto';
import { JwtService } from '@nestjs/jwt';
import { NewPasswordDto } from './dto/new-password-dto';
import { CryptoService } from '../common/crypto/crypto.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private cryptoService: CryptoService,
  ) {}

  async login(userLogin: LoginAuthDto) {
    const { username, password } = userLogin;
    const findUser = await this.userRepository.findOne({ where: { username } });

    if (!findUser) {
      return new HttpException('Usuario no existe', HttpStatus.NOT_FOUND);
    }
    if (!findUser.status) {
      return new HttpException('Usuario bloqueado', HttpStatus.UNAUTHORIZED);
    }
    const checkPassword = await this.cryptoService.comparePasswords(
      password,
      findUser.password,
    );

    if (!checkPassword)
      return new HttpException('Password incorrecta', HttpStatus.FORBIDDEN);

    const payload = { id: findUser.email, name: findUser.username };
    const token = this.jwtService.sign(payload);

    const data = {
      user: findUser,
      token,
    };

    return data;
  }

  async generateCode(userCode: GenerateCodeDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        email: userCode.email,
      },
    });

    if (!userFound) {
      return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    if (!userFound.status) {
      return new HttpException('Usuario bloqueado', HttpStatus.UNAUTHORIZED);
    }

    //generar codigo random
    const newCode = Math.random().toString(20).substring(2, 10).toUpperCase();
    console.log('Enviando correo con codigo: ', newCode);
    await this.userRepository.update(userFound.id, {
      secretCode: await this.cryptoService.hashPassword(newCode),
    });

    return HttpStatus.OK;
  }

  async newPassword(newPassword: NewPasswordDto) {
    const findUser = await this.userRepository.findOne({
      where: { email: newPassword.email },
    });

    if (!findUser) {
      return new HttpException('Correo no existe', HttpStatus.NOT_FOUND);
    }
    if (!findUser.secretCode) {
      return new HttpException('Opción no válida', HttpStatus.FORBIDDEN);
    }

    const checkCode = await this.cryptoService.comparePasswords(
      newPassword.secretCode,
      findUser.secretCode,
    );

    if (!checkCode) {
      return new HttpException('Codigo incorrecto', HttpStatus.FORBIDDEN);
    }

    const passToHash = await this.cryptoService.hashPassword(
      newPassword.password,
    );
    return this.userRepository.update(
      { id: findUser.id },
      { password: passToHash, secretCode: null },
    );
  }
}
