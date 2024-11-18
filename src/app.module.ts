import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { MailerService } from './mail/mail.service';
import { BookingModule } from './booking/booking.module';
import { PackagesModule } from './packages/packages.module';
import { PilotModule } from './pilot/pilot.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [AuthModule, PrismaModule, BookingModule, PackagesModule, PilotModule, HomeModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, MailerService],
})
export class AppModule {}
