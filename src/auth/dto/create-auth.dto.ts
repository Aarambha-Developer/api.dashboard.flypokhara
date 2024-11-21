import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ example: 'name', required: true })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @ApiProperty({ example: 'RbK9D@example.com', required: true })
  @IsNotEmpty({ message: 'Name is required' })
  email: string;
  @ApiProperty({ example: 'password', required: true })
  @IsNotEmpty({ message: 'Name is required' })
  password: string;
  @ApiProperty({ example: '98xxxxxxxx' })
  contact: string;

  @ApiProperty({ example: 'about' })
  about: string;
  @ApiProperty({ example: 'AGENCY' })
  role: Role;
}

enum Role {
  ADMIN = 'ADMIN',
  AGENCY = 'AGENCY',
}

export class LoginDto {
  @ApiProperty({ example: 'test@admin.com', required: true })
  @IsNotEmpty({ message: 'Name is required' })
  email: string;
  @ApiProperty({ example: '87654321', required: true })
  @IsNotEmpty({ message: 'Name is required' })
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'Old Password', required: true })
  @IsNotEmpty({ message: 'Old password required' })
  oldPassword: string;
  @ApiProperty({ example: 'new Password', required: true })
  @IsNotEmpty({ message: 'New Password required' })
  password: string;
  @ApiProperty({ example: 'Confirm Password', required: true })
  @IsNotEmpty({ message: 'New Password required' })
  confirmPassword: string;
}

export class ForgetPasswordDto {
  @IsNotEmpty({ message: 'Email required' })
  @ApiProperty({ example: 'RbK9D@example.com', required: true })
  email: string;
}
export class VerifyOtpDto {
  @ApiProperty({ example: 'RbK9D@example.com', required: true })
  @IsNotEmpty({ message: 'Email required' })
  email: string;
  @ApiProperty({ example: '123456', required: true })
  @IsNotEmpty({ message: 'OTP required' })
  otp: number;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'new Password', required: true })
  @IsNotEmpty({ message: 'New Password required' })
  password: string;
  @ApiProperty({ example: 'Confirm Password', required: true })
  @IsNotEmpty({ message: 'New Password required' })
  confirmPassword: string;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'name', required: true })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  
  @ApiProperty({ example: '98xxxxxxxx' })
  contact: string;

  @ApiProperty({ example: 'about' })
  about: string;
}