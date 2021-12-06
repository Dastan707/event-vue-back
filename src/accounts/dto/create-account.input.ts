import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  // @Field(() => Int)
  // id: number;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;
}
