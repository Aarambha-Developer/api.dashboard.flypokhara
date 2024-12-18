import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import {
  ChangePasswordDto,
  CreateAuthDto,
  LoginDto,
  ResetPasswordDto,
  UpdateUserDto,
} from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import responseHelper from 'src/helper/response-helper';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MailerService } from 'src/mail/mail.service';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}

  async register(createAuthDto: CreateAuthDto, authUser: any) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        email: createAuthDto.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        about: true,
        role: true,
      },
    });
    if (userExists) {
      throw new BadRequestException(
        responseHelper.error('User already exists', userExists),
      );
    }
    const saltORRounds = 10;

    const user = await this.prisma.user.create({
      data: {
        ...createAuthDto,
        password: await bcrypt.hash(createAuthDto.password, saltORRounds),
        role: authUser?.role === 'ADMIN' ? createAuthDto.role : 'AGENCY',
      },
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        about: true,
        role: true,
      },
    });
    return responseHelper.success(' created successfully', user);
  }
  async login(createAuthDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: createAuthDto.email,
      },
    });
    if (!user) {
      throw new BadRequestException(
        responseHelper.error('Not found', {
          email: ['Invalid email'],
        }),
      );
    }

    if (await bcrypt.compare(createAuthDto.password, user.password)) {
      const payload = { id: user.id, email: user.email, role: user.role };
      return responseHelper.success('Logged in successfully', {
        access_token: this.jwtService.sign(payload, {
          secret: process.env.JWT_SECRET,
        }),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          contact: user.contact,
          about: user.about,
          role: user.role,
        },
      });
    } else {
      throw new BadRequestException(
        responseHelper.error('Invalid password', {
          password: ['Invalid password'],
        }),
      );
    }
  }
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        about: true,
        role: true,
      },
    });
    if (!users) {
      throw new NotFoundException(
        responseHelper.error("NO AGENCY'S FOUND", null),
      );
    }
    return responseHelper.success('Available Founds', users);
  }
  async changePassword(id: number, changePassword: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException(responseHelper.error('User not found'));
    }
    if (changePassword.password !== changePassword.confirmPassword) {
      throw new BadRequestException(
        responseHelper.error('Confirm password does not match', {
          password: ['Password does not match'],
        }),
      );
    }
    const compareOldPassword = await bcrypt.compare(
      changePassword.oldPassword,
      user.password,
    );
    if (!compareOldPassword) {
      throw new BadRequestException(
        responseHelper.error('Invalid old password', {
          oldPassword: ['Invalid old password'],
        }),
      );
    }
    const slateORRounds = 10;
    const updatedUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        password: await bcrypt.hash(changePassword.password, slateORRounds),
      },
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        about: true,
        role: true,
      },
    });
    return responseHelper.success('Password changed successfully', updatedUser);
  }
  async updateProfile(authUser: { id: number }, updateAuthDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: authUser.id,
      },
    });
    if (!user) {
      throw new NotFoundException(responseHelper.error('User not found'));
    }
    const updatedUser = await this.prisma.user.update({
      where: {
        id: authUser.id,
      },
      data: {
        name: updateAuthDto.name,
        contact: updateAuthDto.contact,
        about: updateAuthDto.about,
      },
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        about: true,
        role: true,
      },
    });
    return responseHelper.success('Profile updated successfully', updatedUser);
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        about: true,
        role: true,
        bookings: true,
      },
    });
    if (!user) {
      throw new NotFoundException(responseHelper.error('Not found'));
    }
    return responseHelper.success('User found successfully', user);
  }
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException(responseHelper.error('Not found'));
    }
    // Generate a reset token
    const resetToken = this.jwtService.sign(
      { id: user.id },
      { expiresIn: '30m', secret: process.env.JWT_SECRET },
    );
    // Send email
    await this.mailService.sendForgotPasswordEmail(user.email, resetToken);
    return responseHelper.success('Password reset email sent successfully');
  }
  async getProfile(authUser: any) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: authUser.id,
      },
      select: {
        id: true,
        contact: true,
        name: true,
        about: true,
      },
    });
    if (!user) {
      throw new NotFoundException(responseHelper.error('Not found'));
    }
    return responseHelper.success('User found successfully', user);
  }

  async resetPassword(user: any, resetPasswordDto: ResetPasswordDto) {
    const saltORRounds = 10;
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: await bcrypt.hash(resetPasswordDto.password, saltORRounds),
      },
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        about: true,
        role: true,
      },
    });
    return responseHelper.success('Password changed successfully', updatedUser);
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException(responseHelper.error('Not found'));
    }
    await this.prisma.user.delete({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        about: true,
        role: true,
      },
    });
    return responseHelper.success('User deleted successfully', user);
  }

  async initAdmin() {
    const user = await this.prisma.user.create({
      data: {
        name: 'Admin',
        email: 'dev@aarambhait.com',
        role: 'ADMIN',
        password: await bcrypt.hash('dev@aarambhait', 10),
      },
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        about: true,
        role: true,
      },
    });
    return responseHelper.success('Admin created successfully', user);
  }
  async removeAll() {
    const deletedUsers = await this.prisma.user.deleteMany();
    return responseHelper.success(
      'All users deleted successfully',
      deletedUsers,
    );
  }
}
