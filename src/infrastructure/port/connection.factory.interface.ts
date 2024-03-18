import { IConnectionDB } from './connection.db.interface'
import { InfluxDB } from '@influxdata/influxdb-client'

export interface IConnectionFactory {
    createConnection(uri: string | IConnectionDB, options?: IDBOptions | IEventBusOptions): Promise<any>
}

export interface IConnectionFactoryDB {
    createConnection(): InfluxDB

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
