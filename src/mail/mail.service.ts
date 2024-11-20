import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST, // Replace with your SMTP host
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process?.env.MAIL_USER, // Your email address
      pass: process.env.MAIL_PASSWORD, // Your email password
    },
  });

  async sendForgotPasswordEmail(to: string, resetToken: string) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await this.transporter.sendMail({
      from: '"Your App" <no-reply@yourapp.com>',
      to,
      subject: 'Password Reset Request',
      html: ` <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <a href="${`${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`}">Reset Password</a> <br/>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <p style="margin-top: 20px;">If you did not request this, please ignore this email.</p>
          <p style="color: #555;">This link is valid for 15 minutes.</p>
        </div>`,
    });
  }
}
