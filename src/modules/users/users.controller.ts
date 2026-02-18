import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRegisterReqDto } from './dto/users-register.req.dto';
import SETTINGS from 'src/lib/constants/settings';
import { UsersLoginReqDto } from './dto/users-login.req.dto';
import { JwtAuthGuard } from 'src/lib/guards/jwt-auth.guard';
import { Users } from './users.entity';
import { CurrentUser } from 'src/lib/decorators/current-user.decorator';
import { UsersProfileResDto } from './dto/users-profile.res.dto';
import { UserLogoutResponseDto } from './dto/users-logout.res.dto';

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

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @CurrentUser() user: Users,
  ): Promise<UsersProfileResDto | null> {
    return await this.usersService.getProfile(user.id);
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: Request & { authorization: string },
  ): Promise<UserLogoutResponseDto> {
    const authHeader = req.headers['authorization'] as string | undefined;
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      throw new Error('Token not found');
    }
    return await this.usersService.logout(token);
  }
}
