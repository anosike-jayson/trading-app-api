import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, 
      },
    });
  }

  async sendOTPEmail(to: string, otp: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: '"Trading App" <your-email@gmail.com>',
        to,
        subject: 'Verify Your Email',
        text: `Your OTP is ${otp}. It expires in 10 minutes.`,
      });
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw new Error('Unable to send OTP email');
    }
  }
}