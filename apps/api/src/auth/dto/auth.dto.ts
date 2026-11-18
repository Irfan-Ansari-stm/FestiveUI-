import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'developer@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password@123456', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: 'Alex' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Developer' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'Acme Corp' })
  @IsOptional()
  @IsString()
  company?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'developer@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password@123456' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'developer@example.com' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({ example: 'NewSecret@2026', minLength: 8 })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
