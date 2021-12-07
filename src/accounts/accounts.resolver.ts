import {Resolver, Query, Mutation, Args, Int, Context} from '@nestjs/graphql';

import { Account } from './entities/account.entity';
import { CreateUserInput } from './dto/create-account.input';
import {UseGuards} from "@nestjs/common";

import {AccountsService} from "./accounts.service";
import {LoginResponse} from "./dto/login-response.dto";
import {LoginUserInput} from "./dto/login-user.input";
import {JwtAuthGuard} from "./jwt-auth.guard";

@Resolver(() => Account)
export class AccountsResolver {
  constructor(private readonly accountsService: AccountsService) {}

  @Mutation(() => LoginResponse)
  login(@Args('loginUserInput') loginUserInput: LoginUserInput){
    return this.accountsService.login(loginUserInput);
  }

  @Mutation(()=> Account)
  signup(@Args('createUserInput') createUserInput: CreateUserInput, @Context() context){
    return this.accountsService.registration(createUserInput);
  }


  // @Mutation(() => Account)
  // createAccount(@Args('createAccountInput') createAccountInput: CreateUserInput) {
  //   return this.accountsService.create(createAccountInput);
  // }
  //
  // @Query(() => [Account], { name: 'accounts' })
  // findAll() {
  //   return this.accountsService.findAll();
  // }
  //
  // @Query(() => Account, { name: 'account' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.accountsService.findOne(id);
  // }
  //
  // @Mutation(() => Account)
  // updateAccount(@Args('updateAccountInput') updateAccountInput: UpdateAccountInput) {
  //   return this.accountsService.update(updateAccountInput.id, updateAccountInput);
  // }
  //
  // @Mutation(() => Account)
  // removeAccount(@Args('id', { type: () => Int }) id: number) {
  //   return this.accountsService.remove(id);
  // }
}
