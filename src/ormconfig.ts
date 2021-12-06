import { ConnectionOptions } from 'typeorm';
import {Account} from "./users/entities/user.entity";

const config: ConnectionOptions={
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'blocknote',
    password: 'blocknote',
    database: 'blocknote',
    entities: [Account],
    synchronize: true,
}
export default config