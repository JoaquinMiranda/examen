import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private userService: UsersService) {}

  onModuleInit() {
    this.userService.firstUser();
  }

  getHello(): string {
    return 'Examen Neox';
  }
}
