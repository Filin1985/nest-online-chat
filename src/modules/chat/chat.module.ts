import { Module } from '@nestjs/common';
import { ChatMessage } from './chat-message.entity';
import { BlacklistedTokens } from '../users/blacklisted-tokens.entity';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ChatController } from './chat.controller';
import { UsersService } from '../users/users.service';
import { Users } from '../users/users.entity';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessage, Users, BlacklistedTokens]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.get<string>('JWT_SECRET') ?? 'defaultSecret',
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') ?? '1h',
        },
      }),
    }),
  ],
  controllers: [ChatController],
  providers: [UsersService],
})
export class ChatModule {}
