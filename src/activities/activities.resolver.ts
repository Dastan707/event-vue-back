import {Resolver, Query, Mutation, Args, Int, Context} from '@nestjs/graphql';
import { ActivitiesService } from './activities.service';
import { Activity } from './entities/activity.entity';
import { CreateActivityInput } from './dto/create-activity.input';
import {DateIntervalInput} from "./dto/dateInterval.input";


@Resolver(() => Activity)
export class ActivitiesResolver {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Mutation(() => Activity)
  createActivity(@Args('createActivityInput') createActivityInput: CreateActivityInput, @Context() context) {
    return this.activitiesService.createActivity(createActivityInput);
  }


  @Query(() => [Activity], { name: 'dates' })
  findActivityLocationAvailable(@Args('dateIntervalInput') dateIntervalInput: DateIntervalInput) {
    return this.activitiesService.findActivityAvailable(dateIntervalInput);
  }
}
