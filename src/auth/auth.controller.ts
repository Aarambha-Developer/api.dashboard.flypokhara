import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  CreateAuthDto,
  ForgetPasswordDto,
  LoginDto,
  ResetPasswordDto,
} from './dto/create-auth.dto';
import { Roles } from 'src/roles/roles.decorator';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';
import { CurrentUser } from 'src/current-user/current-user.decorator';

// @ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto, @CurrentUser() user: any) {
    return this.authService.register(createAuthDto, user);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Get('users')
  findAll() {
    return this.authService.findAll();
  }
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch('change-password')
  profile(@CurrentUser() user: any, @Body() changePassword: ChangePasswordDto) {
    return this.authService.changePassword(user.id, changePassword);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgotPassword(forgetPasswordDto.email);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch('reset-password')
  resetPassword(
    @CurrentUser() user: any,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(user, resetPasswordDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
  @Post('init-admin')
  initAdmin() {
    return this.authService.initAdmin();
  }
}
