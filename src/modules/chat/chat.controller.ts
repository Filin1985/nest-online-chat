import { Controller, Get } from '@nestjs/common';

@Controller('chat')
export class ChatController {
  @Get('health')
  checkHealth() {
    return {
      status: 'OK',
      message: 'Chat service is healthy',
      timestamp: new Date(),
    };
  }
}
