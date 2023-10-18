import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { initUser } from '../../init';
import { CryptoService } from '../common/crypto/crypto.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private cryptoService: CryptoService,
  ) {}

  async createUser(user: CreateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        username: user.username,
      },
    });

    if (userFound) {
      return new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    // return this.encryptAndSave(user);
    const { password } = user;
    const passToHash = await this.cryptoService.hashPassword(password);
    user = { ...user, password: passToHash };
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  getUsers() {
    return this.userRepository.find();
  }

  async getUser(id: number) {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!userFound) {
      return this.notFoundUser();
    }
    return userFound;
  }

  async deleteUser(id: number) {
    const result = await this.userRepository.delete({ id });

    if (result.affected === 0) {
      return this.notFoundUser();
    }
    return result;
  }

  async updateUser(id: number, user: UpdateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!userFound) {
      return this.notFoundUser();
    }

    return this.userRepository.update({ id }, user);
  }

  async firstUser() {
    const userFound = await this.userRepository.findOne({
      where: {
        email: initUser.email,
      },
    });
    if (!userFound) {
      this.encryptAndSave(Object.assign(new CreateUserDto(), initUser));
    }
  }

  async changeUserStatus(id: number) {
    const userFound = await this.userRepository.findOne({ where: { id } });

    if (!userFound) {
      return this.notFoundUser();
    }
    return await this.userRepository.update(
      { id },
      { status: userFound.status ? false : true },
    );
  }

  async encryptAndSave(user: CreateUserDto) {
    const { password } = user;
    const passToHash = await this.cryptoService.hashPassword(password);
    user = { ...user, password: passToHash };
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  notFoundUser() {
    return new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
