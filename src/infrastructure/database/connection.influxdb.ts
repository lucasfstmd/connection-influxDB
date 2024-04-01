import { ConnectionOptions, InfluxDB } from '@influxdata/influxdb-client'
import { EventEmitter } from 'events'
import { inject, injectable } from 'inversify'
import { ILogger } from '../../utils/custom.logger'
import { Identifier } from '../../di/identifiers'
import { IConnectionFactory } from '../port/connection.factory.interface'
import { IDatabase } from '../port/database.interface'

@injectable()
export class ConnectionInfluxDB implements IDatabase {
    private _connection?: InfluxDB

    private readonly _eventConnection: EventEmitter

    constructor(
        @inject(Identifier.INFLUXDB_CONNECTION_FACTORY) private readonly _connectionFactory: IConnectionFactory,
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

    public async tryConnect(uri: string, options?: ConnectionOptions): Promise<void> {
        try {
            this._connection = await this._connectionFactory.createConnection(uri, options)
            this._eventConnection.emit('connected')
            this._logger.info('Connection established with InfluxDB...')
        } catch (err: any) {
            this._connection = undefined
            this._eventConnection.emit('disconnected')
            this._logger.warn(`Error trying to connect for the first time with InfluxDB! ${err.message}`)
            setTimeout(async () => {
                this.tryConnect(uri, options).then()
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
