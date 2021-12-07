import {forwardRef, Inject, Injectable} from '@nestjs/common';
import { CreateActivityInput } from './dto/create-activity.input';
import {InjectRepository} from "@nestjs/typeorm";
import {Activity} from "./entities/activity.entity";
import {Repository} from "typeorm";
import {LocationsService} from "../locations/locations.service";
import {DateIntervalInput} from "./dto/dateInterval.input";


@Injectable()
export class ActivitiesService {

  constructor(
      @InjectRepository(Activity)
      private readonly activityRepository: Repository<Activity>,
      @Inject(forwardRef(() => LocationsService))
      private locationService: LocationsService,
  ) {
  }


  async create(dto: CreateActivityInput) {
    const activity = new Activity()
    const day = new Date(dto.day)
    const location = await this.locationService.findById(dto.location)
    await this.locationService.findByLocationAndTime(dto.location, day)
    Object.assign(activity, dto)
    activity.location = location
    return this.activityRepository.save({...activity, day: day})
  }

  async createActivity(activityDto: CreateActivityInput) {
    return this.create(activityDto);
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

  async findAll(){
    return this.activityRepository.find()
  }
}
