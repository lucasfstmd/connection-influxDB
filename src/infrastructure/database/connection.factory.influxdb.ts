import { IConnectionFactory } from '../port/connection.factory.interface'
import { ConnectionOptions, InfluxDB } from '@influxdata/influxdb-client'
import { injectable } from 'inversify'

@injectable()
export class ConnectionFactoryInfluxDB implements IConnectionFactory {

    public createConnection(uri: string, options: ConnectionOptions): InfluxDB {
        return new InfluxDB(options)
    }
}
