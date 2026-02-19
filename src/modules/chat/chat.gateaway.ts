/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from './chat-message.entity';
import { Repository } from 'typeorm';

@WebSocketGateway({
  cors: {
    origins: ['http://localhost:5001'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
  ) {}
  handleDisconnect(client: Socket) {
    if (client.data.userId) {
      console.log('user disconnected', client.data.username);

      this.server.emit('userDisconnected', {
        userId: client.data.userId,
        username: client.data.username,
        timestamp: new Date(),
      });

      this.broadcastUserList();
    }
  }

  async handleConnection(client: Socket) {
    try {
      const token = (client.handshake.query.token ||
        client.handshake.headers.authorization?.replace('Bearer ', '')) as
        | string
        | undefined;

      if (!token) {
        throw new Error('Token not found');
      }

      if (await this.usersService.isTokenBlacklisted(token)) {
        throw new Error('Token is blacklisted');
      }

      const payload: { sub: number } = this.jwtService.verify(token);

      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new Error('User not found');
      }

      client.data.userId = user.id;
      client.data.username = user.name;
      client.data.email = user.email;

      console.log('user connected', user.name);

      this.server.emit('userConnected', {
        userId: user.id,
        username: user.name,
        timestamp: new Date(),
      });

      client.emit('authenticated', {
        userId: user.id,
        username: user.name,
        email: user.email,
      });

      this.broadcastUserList();
    } catch (error) {
      console.log(error);
      client.emit('unauthorized', 'Authentication failed');
      client.disconnect();
    }
  }

  private broadcastUserList(): void {
    const userList = this.getOnlineUsers();
    this.server.emit('onlineUsers', userList);
  }

  private getOnlineUsers() {
    const onlineUsers: { userId: number; username: string; email: string }[] =
      [];
    const sockets = this.server.sockets.sockets;
    sockets.forEach((socket: Socket) => {
      if (socket.data.userId) {
        onlineUsers.push({
          userId: socket.data.userId as number,
          username: socket.data.username as string,
          email: socket.data.email as string,
        });
      }
    });
    return onlineUsers;
  }
}
