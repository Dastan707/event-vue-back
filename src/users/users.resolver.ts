import {Resolver, Query, Mutation, Args, Int, Context} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Account } from './entities/user.entity';
import {UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Resolver(() => Account)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}


  @Query(() => [Account], { name: 'users' })
  @UseGuards(JwtAuthGuard)
  findAll(@Context() context) {
    return this.usersService.findAll();
  }

  // @Query(() => Account, { name: 'user' })
  // findOne(@Args('username') username: string) {
  //   return this.usersService.findOne(username);
  // }


}
