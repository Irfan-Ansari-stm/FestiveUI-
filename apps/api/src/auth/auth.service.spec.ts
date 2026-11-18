import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwt: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn()
      },
      role: {
        findUnique: jest.fn().mockResolvedValue({ id: 'role-dev-id', name: 'DEVELOPER' })
      }
    };

    jwt = {
      signAsync: jest.fn().mockResolvedValue('mock_token'),
      verify: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw ConflictException if user already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'existing-id' });

      await expect(
        service.register({ email: 'test@example.com', password: 'Password@123' })
      ).rejects.toThrow(ConflictException);
    });

    it('should register a new developer user and issue JWT tokens', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'new-user-id',
        email: 'test@example.com',
        profile: { firstName: 'Alex' },
        userRoles: [{ role: { name: 'DEVELOPER' } }]
      });

      const result = await service.register({
        email: 'test@example.com',
        password: 'Password@123',
        firstName: 'Alex'
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.roles).toContain('DEVELOPER');
    });
  });

  describe('login', () => {
    it('should reject non-existing email with UnauthorizedException', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'unknown@example.com', password: 'Password@123' })
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should reject wrong password with UnauthorizedException', async () => {
      const hash = await bcrypt.hash('CorrectPass@123', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-id',
        email: 'test@example.com',
        passwordHash: hash,
        userRoles: []
      });

      await expect(
        service.login({ email: 'test@example.com', password: 'WrongPassword' })
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should successfully login and issue tokens with correct credentials', async () => {
      const hash = await bcrypt.hash('CorrectPass@123', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-id',
        email: 'test@example.com',
        passwordHash: hash,
        status: 'ACTIVE',
        profile: null,
        userRoles: [{ role: { name: 'DEVELOPER' } }]
      });

      const res = await service.login({ email: 'test@example.com', password: 'CorrectPass@123' });
      expect(res).toHaveProperty('accessToken');
      expect(res.user.email).toBe('test@example.com');
    });
  });
});
