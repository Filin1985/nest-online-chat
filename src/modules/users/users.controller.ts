import {
  Body,
  Controller,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRegisterReqDto } from './dto/users-register.req.dto';
import SETTINGS from 'src/lib/constants/settings';
import { UsersLoginReqDto } from './dto/users-login.req.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async register(
    @Body(SETTINGS.VALIDATION_PIPE)
    body: UsersRegisterReqDto,
  ) {
    return await this.usersService.register(body);
  }

  @Post('/login')
  async login(
    @Body(SETTINGS.VALIDATION_PIPE)
    body: UsersLoginReqDto,
  ) {
    return await this.usersService.login(body);
  }
}
