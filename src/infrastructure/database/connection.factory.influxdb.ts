import { IConnectionFactory } from '../port/connection.factory.interface'
import { InfluxDB } from '@influxdata/influxdb-client'
import { hostname } from 'os'
import { injectable } from 'inversify'
import { Default } from '../../utils/default'

@injectable()
export class ConnectionFactoryInfluxDB implements IConnectionFactory {

    public createConnection(): Promise<InfluxDB> {
        const influx: InfluxDB | undefined = new InfluxDB({
            url: process.env.INFLUXDB_URL || Default.INFLUXDB_URL,
            token: process.env.INFLUXDB_TOKEN || Default.INFLUXDB_TOKEN
        })

        return Promise.resolve(influx)
    }

    public writeApi(org: string, bucket: string): Promise<void> {
        return this.createConnection().then((influx: InfluxDB) => {
            influx.getWriteApi(org, bucket, 'ns', {
                defaultTags: {
                    service: 'timeseries',
                    host: hostname()
                }
            })
        }).catch((error: any) => {
            Promise.resolve(error.message)
        })
    }
}
