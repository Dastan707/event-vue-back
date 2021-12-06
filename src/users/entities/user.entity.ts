import { ObjectType, Field, Int } from '@nestjs/graphql';
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
@ObjectType()
export class Account {
  @PrimaryGeneratedColumn()
  @Field()
  id: number

  @Column()
  @Field()
  username: string;

  @Column()
  @Field()
  password: string;
}
