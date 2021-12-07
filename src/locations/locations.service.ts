import {forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
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
import {Activity} from "../activities/entities/activity.entity";
import {dayInput} from "./dto/day.input";
import {ActivitiesService} from "../activities/activities.service";





@Injectable()
export class LocationsService {
  constructor(
      @InjectRepository(Location)
      private readonly locationService: Repository<Location>,
      // @Inject(forwardRef(() => ActivitiesService))
      // private activitiesService: ActivitiesService,
      private readonly jwtService: JwtService) {
  }

  async createLocation(dto: CreateLocationInput, token) {
    const location = new Location()
    const currentUser = this.jwtService.verify(token)
    console.log(currentUser)
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



  async findById(id: number){
    return this.locationService.findOne(id)
  }

  async findByLocation(id: number) {
    const locationById = await this.locationService.findOne(id, {relations: ["activities"]})

    if (!locationById) {
      throw new HttpException('there is no such location', HttpStatus.NOT_FOUND)
    }
    const currentActivity = locationById.activities
    console.log(currentActivity)
    return currentActivity

  }

  async findByLocationAndTime(id: number, day:Date) {
    const locationById = await this.locationService.findOne(id, {relations: ["activities"]})
    if (!locationById) {
      throw new HttpException('there is no such location', HttpStatus.NOT_FOUND)
    }
    const currentActivity = locationById.activities

    let data = []
    for (let x of currentActivity){
      data.push((x.day).toLocaleDateString())
    }

    for (let x of data ){
      if ((day.toLocaleDateString()).toString() == x){
        throw new HttpException('на этот день занято', HttpStatus.NOT_FOUND)
      }
    }
    return new HttpException('Created', HttpStatus.OK)

  }

  async findAll(){
    return this.locationService.find()
  }

  // async availableLocationByDate(dto: dayInput){
  //   const date = dto.day
  //   const newDate = new Date(date).toLocaleDateString()
  //   const allActivity = await this.activitiesService.findAll()
  //   const locationData = await this.findAll()
  //   const dataLocation = []
  //   const dataDate = []
  //   const blackList = []
  //   const veryWhitelist = []
  //   for ( let i of locationData) {
  //     dataLocation.push(i.id)
  //   }
  //   for (let i of allActivity){
  //     if ( newDate === (i.day).toLocaleDateString()){
  //       for (let x of dataLocation){
  //         if (i.location.id === x){
  //           blackList.push(i.location.id)
  //           dataDate.push(i)
  //         }
  //       }
  //     }
  //   }
  //   let difference = dataLocation.filter(x => !blackList.includes(x)).concat(blackList.filter(x => !dataLocation.includes(x)));
  //   for ( let i of difference){
  //     let x = await this.findWhiteLocation(i)
  //
  //     veryWhitelist.push(x.address)
  //   }
  //
  //   console.log(veryWhitelist)
  //   return veryWhitelist
  // }

  async findWhiteLocation(id:number){
    return await this.locationService.findOne(id)
  }
}
