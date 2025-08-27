import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendTestEmail(@Body() body: { email: string }) {
    await this.emailService.sendMemberRegistrationEmail(body.email);
    return { message: 'Email thông báo đăng ký hội viên đã được gửi thành công' };
  }
}