import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  @MessagePattern('health')
  health() {
    return { status: 'quotation-service alive' };
  }
}
