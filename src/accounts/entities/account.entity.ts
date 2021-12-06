import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  JoinTable
} from "typeorm";
import {Location} from "../../locations/entities/location.entity";
import {Field, ObjectType} from "@nestjs/graphql";

@Entity()
@ObjectType()
export class Account extends BaseEntity{

  @PrimaryGeneratedColumn()
  @Field()
  id: number

  @Column({unique: true})
  @Field()
  username: string

  @Column({unique: true})
  @Field()
  email: string

  @Column()
  @Field()
  password: string

  // @OneToMany(()=>Activity,(activity)=>activity.account)
  // @JoinColumn()
  // activities:Activity[]

  @OneToMany(type => Location, location => location.account)
  @JoinTable()
  @Field(type =>[Location], {nullable: true})
  locations: Location[];
}