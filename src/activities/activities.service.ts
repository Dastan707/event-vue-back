import {forwardRef, Inject, Injectable} from '@nestjs/common';
import { CreateActivityInput } from './dto/create-activity.input';
import {InjectRepository} from "@nestjs/typeorm";
import {Activity} from "./entities/activity.entity";
import {In, Repository} from "typeorm";
import {LocationsService} from "../locations/locations.service";
import {DateIntervalInput} from "./dto/dateInterval.input";
import {dayInput} from "./dto/day.input";
import {JwtService} from "@nestjs/jwt";


@Injectable()
export class ActivitiesService {

  constructor(
      @InjectRepository(Activity)
      private readonly activityRepository: Repository<Activity>,
      // @Inject(forwardRef(() => LocationsService))
      private locationService: LocationsService,
      private readonly jwtService: JwtService
  ) {
  }


  async create(dto: CreateActivityInput, token) {
    const activity = new Activity()
    const day = new Date(dto.day)
    const location = await this.locationService.findById(dto.location)
    await this.locationService.findByLocationAndTime(dto.location, day)
    const currentUser = await this.jwtService.verify(token)
    Object.assign(activity, dto)
    activity.account = currentUser
    activity.location = location
    return this.activityRepository.save({...activity, day: day})
  }

  async createActivity(activityDto: CreateActivityInput, currentUser) {
    return this.create(activityDto, currentUser);
  }

  async findActivityAvailable(dto: DateIntervalInput){
    const start = dto.startDay
    const end = dto.endDay
    const listOfDates = await this.enumerateDaysBetweenDates(start,end)
    const data = await this.activityRepository.find()
    const dataActivity = []
    for (let x of data){
      const day = ((x.day).toLocaleDateString())
      const id = x.id
      for (let i of listOfDates){
        if (i === day){
          dataActivity.push(id)
        }
      }
    }
    const dats = []
    for (let x of dataActivity){
      const resData = await this.activityRepository.findOne({id: x})
      dats.push(resData)
    }
    return dats
  }

  async enumerateDaysBetweenDates(start, end){
    const arr = [];
    const dt = new Date(start);
    const ends = new Date(end);
    while (dt <= ends) {
      arr.push((new Date(dt)).toLocaleDateString());
      dt.setDate(dt.getDate() + 1);
    }
    return arr
  }

  async availableLocationByDate(dto: dayInput){
    const date = dto.day
    const newDate = new Date(date).toLocaleDateString()
    const allActivity = await this.findAll()
    const locationData = await this.locationService.findAll()
    const dataLocation = []
    const blackList = []
    for ( let i of locationData) {
      dataLocation.push(i.id)
    }
    for (let i of allActivity){
      if ( newDate === (i.day).toLocaleDateString()){
        for (let x of dataLocation){
          if (i.location.id === x){
            blackList.push(i.location.id)
          }
        }
      }
    }
    let difference = dataLocation.
    filter(x => !blackList.
    includes(x)).
    concat(blackList.
    filter(x => !dataLocation.includes(x)));
    const activities = await this.locationService.find(difference);
    console.log(activities)
    return activities
  }
  async findAll(){
    return this.activityRepository.find()
  }
}
