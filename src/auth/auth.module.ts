import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import {LocalStrategy} from "./local.strategy";
import {PassportModule} from "@nestjs/passport";
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./jwt.strategy";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Account} from "../users/entities/user.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([Account]),
      PassportModule,
      UsersModule,
      JwtModule.register({
        signOptions: {expiresIn: '60s'},
        secret: 'hide-me', // TODO: process.env.JWT_SECRET
      }),],
  providers: [AuthService, AuthResolver, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
