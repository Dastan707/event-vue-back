import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import {InjectRepository} from "@nestjs/typeorm";
import {Location} from "./entities/location.entity";
import {Repository} from "typeorm";

import {Context} from "@nestjs/graphql";
import {Account} from "../accounts/entities/account.entity";

@Injectable()
export class LocationsService {
  constructor(
      @InjectRepository(Location)
      private readonly locationService: Repository<Location>) {
  }

  async createLocation(dto: CreateLocationInput,@Context() context) {
    const location = new Location()
    Object.assign(location, dto)
    location.account=context.user
    return await this.locationService.save(location)


  }

  async updateLocation(id: number, dto: CreateLocationInput,currentUser:Account) {
    const location = await this.locationService.findOne(id)

    if (!location) {
      throw new HttpException('activity does not exist', HttpStatus.NOT_FOUND)
    }

    if(location.account.username!==currentUser.username){
      throw new HttpException('You are not author', HttpStatus.FORBIDDEN)

    }
    Object.assign(location, dto)
    return await this.locationService.save(location)
  }

  async deleteLocation(id: number,currentUser:Account) {
    const location = await this.locationService.findOne(id)
    if (!location) {
      throw new HttpException('location does not exist', HttpStatus.NOT_FOUND)
    }
    if(location.account.username!==currentUser.username){
      throw new HttpException('You are not author', HttpStatus.FORBIDDEN)

    }
    return await this.locationService.delete(id)
  }

  async findAvailableLocation() {
    const availableLocation = await this.locationService.find()
    if (!availableLocation) {
      throw new HttpException(' no available location', HttpStatus.NOT_FOUND)
    }
    return availableLocation


  }

  // async findByLocation(id: number) {
  //   const locationById = await this.locationService.findOne(id, {relations: ["activities"]})
  //
  //   if (!locationById) {
  //     throw new HttpException('there is no such location', HttpStatus.NOT_FOUND)
  //   }
  //   const currentActivity = locationById.activities
  //   return currentActivity
  //
  // }

  // async findByLocationAndTime(id: number) {
  //   const locationById = await this.locationService.findOne(id, {relations: ["activities"]})
  //   if (!locationById) {
  //     throw new HttpException('there is no such location', HttpStatus.NOT_FOUND)
  //   }
  //   const currentActivity = locationById.activities
  //   let data = []
  //   for (let x of currentActivity){
  //     data.push((x.day).toLocaleDateString())
  //   }
  //   return data
  // }

  async findAll(){
    const locationAll = await this.locationService.find()
    return locationAll
  }

  async findWhiteLocation(id:number){
    return await this.locationService.findOne(id)
  }
}
