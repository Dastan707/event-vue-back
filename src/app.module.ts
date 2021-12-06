import { Module } from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import { join} from 'path';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import ormconfig from "./ormconfig";
import {Account} from "./users/entities/user.entity";

@Module({
  imports: [
      GraphQLModule.forRoot({
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true
  }),
      UsersModule,
      AuthModule,
      TypeOrmModule.forRoot(ormconfig),

  ],

})
export class AppModule {}


