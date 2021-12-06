import {Args, Context, Mutation, Resolver} from '@nestjs/graphql';
import {AuthService} from "./auth.service";
import {LoginResponse} from "./dto/login-response.dto";
import {LoginUserInput} from "./dto/login-user.input";
import {AuthGuard} from "@nestjs/passport";
import {UseGuards} from "@nestjs/common";
import {GqlAuthGuards} from "./gql-auth-guards";
import {User} from "../users/entities/user.entity";

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) {}

    @Mutation(() => LoginResponse)
    @UseGuards(GqlAuthGuards)
    login(@Args('loginUserInput') loginUserInput: LoginUserInput, @Context() context){
        return this.authService.login(context.user);
    }

    @Mutation(()=> User)
    signup(@Args('loginUserInput') loginUserInput: LoginUserInput, @Context() context){
        return this.authService.signup(loginUserInput);
    }
}
