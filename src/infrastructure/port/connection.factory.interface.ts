import { IDatabase } from './database.interface'
import { ConnectionOptions } from '@influxdata/influxdb-client'

export interface IConnectionFactory {
    createConnection(uri?: string | IDatabase, options?: IDBOptions | IEventBusOptions | ConnectionOptions): Promise<any> | any
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
