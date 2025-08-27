import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    return await this.transporter.sendMail({
      from: `"HIỆP HỘI DỮ LIỆU QUỐC GIA" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
  }

  async sendMemberRegistrationEmail(email: string) {
    const subject = 'Chúc mừng! Bạn đã đăng ký hội viên HIỆP HỘI DỮ LIỆU QUỐC GIA thành công';
    const text = `Xin chào! Chúc mừng bạn đã đăng ký hội viên thành công tại HIỆP HỘI DỮ LIỆU QUỐC GIA. Chúng tôi rất vui mừng được chào đón bạn tham gia cộng đồng của chúng tôi.`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2c3e50; text-align: center;">🎉 Chúc mừng!</h1>
        <h2 style="color: #27ae60; text-align: center;">Đăng ký hội viên HIỆP HỘI DỮ LIỆU QUỐC GIA thành công</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="font-size: 16px; color: #2c3e50; margin: 0;">
            Xin chào! Chúng tôi rất vui mừng thông báo rằng bạn đã đăng ký hội viên thành công tại <strong>HIỆP HỘI DỮ LIỆU QUỐC GIA</strong>.
          </p>
        </div>
        
        <p style="font-size: 14px; color: #7f8c8d; line-height: 1.6;">
          Bây giờ bạn có thể:
        </p>
        <ul style="font-size: 14px; color: #7f8c8d; line-height: 1.6;">
          <li>Truy cập tất cả các tính năng dành cho hội viên</li>
          <li>Tham gia các sự kiện và hoạt động của Hiệp hội</li>
          <li>Kết nối với cộng đồng dữ liệu quốc gia</li>
          <li>Nhận thông tin cập nhật mới nhất về dữ liệu</li>
          <li>Tham gia các chương trình đào tạo và phát triển</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://akabot-dn-5-0.vercel.app/login" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Truy cập trang chủ
          </a>
        </div>
        
        <p style="font-size: 12px; color: #95a5a6; text-align: center; margin-top: 30px;">
          Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.<br>
          Trân trọng,<br>
          <strong>HIỆP HỘI DỮ LIỆU QUỐC GIA</strong>
        </p>
      </div>
    `;

    return await this.sendMail(email, subject, text, html);
  }
}