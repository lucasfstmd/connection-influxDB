import { IDisposable } from './disposable.interface'
import { EventEmitter } from 'events'
import { ConnectionOptions, InfluxDB } from '@influxdata/influxdb-client'

export interface IDatabase extends IDisposable {
    connection: InfluxDB | undefined

    eventConnection: EventEmitter

    tryConnect(uri: string, options?: ConnectionOptions): Promise<void>
}
