import { IConnectionFactoryDB } from '../port/connection.factory.interface'
import { InfluxDB } from '@influxdata/influxdb-client'
import { injectable } from 'inversify'
import { Default } from '../../utils/default'

// import { hostname } from 'os'

@injectable()
export class ConnectionFactoryInfluxDB implements IConnectionFactoryDB {

    public createConnection(): InfluxDB {
        return new InfluxDB({
            url: process.env.INFLUXDB_URL || Default.INFLUXDB_URL,
            token: process.env.INFLUXDB_TOKEN || Default.INFLUXDB_TOKEN
        })
    }
}
