import { ObjectType, Field, Int } from '@nestjs/graphql';
import {Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Account} from "../../accounts/entities/account.entity";


@Entity()
@ObjectType()
export class Location {

  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  address: string

  @ManyToOne(type => Account, account => account.locations,{eager:true})
  @JoinTable()
  @Field(type =>[Account], {nullable: true})
  account: Account;
}
