import { IConnectionFactoryDB } from '../port/connection.factory.interface'
import { InfluxDB } from '@influxdata/influxdb-client'
import { injectable } from 'inversify'
import { Default } from '../../utils/default'
// import { hostname } from 'os'

@injectable()
export class ConnectionFactoryInfluxDB implements IConnectionFactoryDB {

    public createConnection(): Promise<InfluxDB> {
        const influx: InfluxDB | undefined = new InfluxDB({
            url: process.env.INFLUXDB_URL || Default.INFLUXDB_URL,
            token: process.env.INFLUXDB_TOKEN || Default.INFLUXDB_TOKEN
        })

        return Promise.resolve(influx)
    }

    // public writeApi(point: Array<Point>, bucket: string): Promise<void> {
    //     return this.createConnection().then((instance) => {
    //         instance.getWriteApi(process.env.INFLUXDB_ORG || Default.INFLUXDB_ORG, bucket, 'ns', {
    //             defaultTags: {
    //                 services: 'timeseries',
    //                 host: hostname()
    //             }
    //         }).writePoints(point)
    //     })
    // }
    //
    // public async queryDB(query: Array<string>): Promise<void> {
    //     return this.createConnection().then((instance) => {
    //         instance.getQueryApi(process.env.INFLUXDB_ORG || Default.INFLUXDB_ORG)
    //             .queryRaw(query)
    //             .then((result) => {
    //                 return result
    //             })
    //             .catch((err) => {
    //                 throw err
    //             })
    //     })
    // }
}
