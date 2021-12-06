import {Module} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsResolver } from './locations.resolver';
import {TypeOrmModule} from "@nestjs/typeorm";
import { Location } from "./entities/location.entity";

import {AccountsModule} from "../accounts/accounts.module";

@Module({

  imports: [AccountsModule, TypeOrmModule.forFeature([Location]), ],
  providers: [LocationsResolver, LocationsService]
})
export class LocationsModule {}