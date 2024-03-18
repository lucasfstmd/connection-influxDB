import { IConnectionDB } from '../port/connection.db.interface'
import { InfluxDB } from '@influxdata/influxdb-client'
import { EventEmitter } from 'events'
import { inject, injectable } from 'inversify'
import { ILogger } from '../../utils/custom.logger'
import { Identifier } from '../../di/identifiers'
import { IConnectionFactoryDB } from '../port/connection.factory.interface'

@injectable()
export class ConnectionInfluxDB implements IConnectionDB {
    private _connection?: InfluxDB

    private readonly _eventConnection: EventEmitter

    constructor(
        @inject(Identifier.INFLUXDB_CONNECTION_FACTORY) private readonly _connectionFactory: IConnectionFactoryDB,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
        this._eventConnection = new EventEmitter()
    }


    get connection(): InfluxDB | undefined {
        return this._connection
    }

    get eventConnection(): EventEmitter {
        return this._eventConnection
    }

    public async tryConnect(): Promise<void> {
        try {
            this._connection = this._connectionFactory.createConnection()
            this._eventConnection.emit('connected')
            this._logger.info('Connection established with InfluxDB...')
        } catch (err: any) {
            this._connection = undefined
            this._eventConnection.emit('disconnected')
            this._logger.warn(`Error trying to connect for the first time with InfluxDB! ${err.message}`)
            setTimeout(async ()  => {
                this.tryConnect().then()
            }, 2000)
        }
    }

    /**
     * Releases the resources.
     *
     * @return {Promise<void>}
     */
    public async dispose(): Promise<void> {
        this._connection = undefined
    }
}
