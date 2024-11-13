import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mail/mail.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Replace with a secure, environment-stored secret
      signOptions: {},
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtService, MailerService],
})
export class AuthModule {}
