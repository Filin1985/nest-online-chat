import {
  Body,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { UsersRegisterReqDto } from './dto/users-register.req.dto';
import { UsersLoginReqDto } from './dto/users-login.req.dto';
import MESSAGES from 'src/lib/constants/message';
import { JwtService } from '@nestjs/jwt';
import { UsersProfileResDto } from './dto/users-profile.res.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
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
      address: body.address,
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
}
