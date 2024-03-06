import { IConnectionDB } from './connection.db.interface'
import { InfluxDB } from '@influxdata/influxdb-client'
// import { Point } from '@influxdata/influxdb-client'

export interface IConnectionFactory {
    createConnection(uri: string | IConnectionDB, options?: IDBOptions | IEventBusOptions): Promise<any>
}

export interface IConnectionFactoryDB {
    createConnection(): Promise<InfluxDB>

    // writeApi(points: Array<Point>, bucket: string): Promise<void>
    //
    // queryDB(query: Array<string>): Promise<any>
}

export interface IDBOptions {
    sslValidate: boolean
    tlsCAFile: any
    tlsCertificateKeyFile: any
    tlsCertificateFile: any
}

export interface IEventBusOptions {
    retries?: number
    interval?: number
    sslOptions?: ISSL
}

export interface ISSL {
    cert?: Buffer
    key?: Buffer
    ca?: Buffer[]
}
