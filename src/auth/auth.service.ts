import { Injectable, BadRequestException, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/configs/mail.service';
import { User, Role } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(email: string, password: string, role?: Role): Promise<{ message: string }> {
    try {
      const existingUser = await this.userRepo.findOne({ where: { email } });
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const user = this.userRepo.create({
        email,
        password: await bcrypt.hash(password, 10),
        role: role || Role.User, 
        otpCode: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), 
      });

      await this.userRepo.save(user);
      await this.mailService.sendOTPEmail(email, otp);

      return { message: 'OTP sent to email' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Registration error:', error);
      throw new InternalServerErrorException('Failed to register user. Please try again.');
    }
  }

  async verify(email: string, otp: string): Promise<{ message: string }> {
    try {
      const user = await this.userRepo.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.otpCode || user.otpCode !== otp || (user.expiresAt && user.expiresAt < new Date())) {
        throw new BadRequestException('Invalid or expired OTP');
      }

      user.isVerified = true;
      user.otpCode = null; 
      user.expiresAt = null;
      await this.userRepo.save(user);

      return { message: 'Email verified' };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      console.error('Verification error:', error);
      throw new InternalServerErrorException('Failed to verify email. Please try again.');
    }
  }

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    try {
      const user = await this.userRepo.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }
      if (!user.isVerified) {
        throw new UnauthorizedException('Email not verified');
      }

      const payload = { sub: user.id, email: user.email, role: user.role };
      return { accessToken: this.jwtService.sign(payload) };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Login error:', error);
      throw new InternalServerErrorException('Failed to login. Please try again.');
    }
  }
}