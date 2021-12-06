import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import {InjectRepository} from "@nestjs/typeorm";
import {Account} from "./entities/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class UsersService {

  constructor(@InjectRepository(Account) private readonly userRepository: Repository<Account>) {}

  async create(createUserInput: CreateUserInput) {
    const user = new Account()
    Object.assign(user, createUserInput)
    return await this.userRepository.save(user)
  }

  findAll() {
    return this.userRepository.find()
  }


  findOne(username: string) {
    return this.userRepository.findOne({where:{username: username}});
  }

}
