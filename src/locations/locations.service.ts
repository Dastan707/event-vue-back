import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import {InjectRepository} from "@nestjs/typeorm";
import {Location} from "./entities/location.entity";
import {Repository} from "typeorm";

import {Context} from "@nestjs/graphql";
import {Account} from "../accounts/entities/account.entity";
import {AccountsService} from "../accounts/accounts.service";
import {JwtService} from "@nestjs/jwt";
import {constants} from "http2";




@Injectable()
export class LocationsService {
  constructor(
      @InjectRepository(Location)
      private readonly locationService: Repository<Location>,
      private readonly jwtService: JwtService) {
  }

  async createLocation(dto: CreateLocationInput, token) {
    const location = new Location()
    const currentUser = this.jwtService.verify(token)
    Object.assign(location, dto)
    location.account=currentUser
    return await this.locationService.save(location)


  }

  async update(id: number, dto: UpdateLocationInput,currentUser) {
    const location = await this.locationService.findOne(id)
    console.log(location)
    const user = this.jwtService.verify(currentUser)
    if (!location) {
      throw new HttpException('activity does not exist', HttpStatus.NOT_FOUND)
    }

    if(location.account.email!==user.email){
      throw new HttpException('You are not author', HttpStatus.FORBIDDEN)
    }
    Object.assign(location, dto)
    return await this.locationService.save(location)
  }

  async remove(id: number, currentUser) {
    const location = await this.locationService.findOne(id)
    const user = this.jwtService.verify(currentUser)

    if (!location) {
      throw new HttpException('location does not exist', HttpStatus.NOT_FOUND)
    }
    if(location.account.email!==user.email){
      throw new HttpException('You are not author', HttpStatus.FORBIDDEN)

    }
    await this.locationService.delete(id)
    return new HttpException('Location was removed', HttpStatus.OK)
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
    const locationAll = await this.locationService.find();
    console.log(locationAll);
    return locationAll
  }

  async findWhiteLocation(id:number){
    return await this.locationService.findOne(id)
  }
}
