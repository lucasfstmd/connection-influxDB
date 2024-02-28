import { IDisposable } from './disposable.interface'
import { EventEmitter } from 'events'
import { InfluxDB } from '@influxdata/influxdb-client'

export interface IConnectionDB extends IDisposable {
    connection: InfluxDB | undefined

    eventConnection: EventEmitter

    tryConnect(): Promise<void>
}
