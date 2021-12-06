import {Resolver, Query, Mutation, Args, Int, Context, Parent} from '@nestjs/graphql';
import { LocationsService } from './locations.service';
import { Location } from './entities/location.entity';
import { CreateLocationInput } from './dto/create-location.input';
import {User} from "../decorators/user.decorator";

import {UseGuards} from "@nestjs/common";
import {Account} from "../accounts/entities/account.entity";
import {JwtAuthGuard} from "../accounts/jwt-auth.guard";

@Resolver(() => Location)
export class LocationsResolver {
  constructor(private readonly locationsService: LocationsService) {}

  @Mutation(() => Location)
  @UseGuards(JwtAuthGuard)
  createLocation(@Args('createLocationInput') createLocationInput: CreateLocationInput,@User('currentUser') currentUser: Account ) {
    console.log(location)
    return this.locationsService.createLocation(createLocationInput, currentUser);
  }

  @Query(() => [Location], { name: 'locations' })
  findAll() {
    return this.locationsService.findAll();
  }


  // @Mutation(() => Location)
  // updateLocation(@Args('updateLocationInput') updateLocationInput: UpdateLocationInput) {
  //   return this.locationsService.update(updateLocationInput.id, updateLocationInput);
  // }
  //
  // @Mutation(() => Location)
  // removeLocation(@Args('id', { type: () => Int }) id: number) {
  //   return this.locationsService.remove(id);
  // }
}
