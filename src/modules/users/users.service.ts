import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { UsersRegisterReqDto } from './dto/users-register.req.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async register(body: UsersRegisterReqDto) {
    const user = this.usersRepository.create({
      name: body.name,
      email: body.email,
      password: body.password,
    });
    return await this.usersRepository.save(user);
  }
}
