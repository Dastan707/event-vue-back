import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import {GqlExecutionContext} from "@nestjs/graphql";


@Injectable()
export class JwtAuthGuard implements CanActivate{
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const ctx = GqlExecutionContext.create(context)

        try {
            const authHeader = ctx.getContext().req.headers.authorization
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            if (bearer !== 'Bearer' || !token){
                throw new UnauthorizedException({message: 'Пользователь не авторизован!'})
            }
            const user = this.jwtService.verify(token);
            if (!user){
                throw new UnauthorizedException({message: 'Пользователь не авторизован!!'})
            }
            return true
        } catch (e){
            throw new UnauthorizedException({message: 'Пользователь не авторизован'})
        }
    }
}