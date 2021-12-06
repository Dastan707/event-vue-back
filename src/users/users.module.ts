import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Account} from "./entities/user.entity";


@Module({
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [UsersResolver, UsersService],

})
export class UsersModule {}
