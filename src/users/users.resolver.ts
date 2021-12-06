import {Resolver, Query, Mutation, Args, Int, Context} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import {UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}


  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard)
  findAll(@Context() context) { //TODO: protect with JWT
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('username') username: string) {
    return this.usersService.findOne(username);
  }


}
