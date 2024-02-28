import { inject, injectable } from 'inversify'
import { IHeartHateRepositoryInterface } from '../../application/port/heart.hate.repository.interface'
import { Identifier } from '../../di/identifiers'
import { ConnectionFactoryInfluxDB } from '../database/connection.factory.influxdb'

@injectable()
export class HeartHateRepository implements IHeartHateRepositoryInterface {

    constructor(
        @inject(Identifier.INFLUXDB_CONNECTION) private readonly _db: ConnectionFactoryInfluxDB,
        @inject(Identifier.)
    ) {
    }
}
