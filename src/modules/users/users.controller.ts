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
}
