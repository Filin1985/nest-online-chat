import {
  Body,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { LessThan, Repository } from 'typeorm';
import { UsersRegisterReqDto } from './dto/users-register.req.dto';
import { UsersLoginReqDto } from './dto/users-login.req.dto';
import MESSAGES from 'src/lib/constants/message';
import { JwtService } from '@nestjs/jwt';
import { UsersProfileResDto } from './dto/users-profile.res.dto';
import { UserLogoutResponseDto } from './dto/users-logout.res.dto';
import { BlacklistedTokens } from './blacklisted-tokens.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(BlacklistedTokens)
    private readonly blacklistedTokensRepository: Repository<BlacklistedTokens>,
    private jwtService: JwtService,
  ) {}

  async register(body: UsersRegisterReqDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: body.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = this.usersRepository.create({
      name: body.name,
      email: body.email,
      password: body.password,
    });
    return await this.usersRepository.save(user);
  }

  async login(body: UsersLoginReqDto) {
    const user = await this.usersRepository.findOne({
      where: { email: body.email },
    });

    if (!user) {
      throw new UnauthorizedException(MESSAGES.INVALID_EMAIL_OR_PASSWORD);
    }

    const isPasswordMatch = await user.comparePassword(body.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException(MESSAGES.INVALID_EMAIL_OR_PASSWORD);
    }

    const payload = { sub: user.id, emit: user.email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
    };
  }

  async findById(id: number): Promise<Users | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async getProfile(id: number): Promise<UsersProfileResDto | null> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async logout(token: string): Promise<UserLogoutResponseDto> {
    const decodedToken = this.jwtService.decode<{ exp: number }>(token);

    const expiresAt = decodedToken?.exp
      ? new Date(decodedToken.exp * 1000)
      : new Date(Date.now() * 3600000);
    const existing = await this.isTokenBlacklisted(token);

    if (existing) {
      return {
        message: 'Token is already blacklisted',
      };
    }

    const blacklistedToken = this.blacklistedTokensRepository.create({
      token,
      expiresAt,
    });
    await this.blacklistedTokensRepository.save(blacklistedToken);

    return {
      message: 'Successfully logged out',
    };
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const existing = await this.blacklistedTokensRepository.findOne({
      where: { token },
    });
    return Boolean(existing);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async cleanExpiredTokens() {
    {
      const now = new Date();
      const result = await this.blacklistedTokensRepository.delete({
        expiresAt: LessThan(now),
      });
      console.log(`Cleaned up ${result.affected || 0} expired tokens`);
    }
  }
}
