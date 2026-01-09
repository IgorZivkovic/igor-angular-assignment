import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DbModule } from '../db/db.module';
import { AuthController } from './auth.controller';
import { AuthRateLimitService } from './auth-rate-limit.service';
import { AuthService } from './auth.service';
import { AuthUsersService } from './auth-users.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [DbModule, PassportModule.register({ session: false }), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthRateLimitService, AuthService, AuthUsersService, LocalStrategy, JwtStrategy],
  exports: [AuthService, AuthUsersService],
})
export class AuthModule {}
