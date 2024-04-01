import fs from 'fs'
import { Default } from './default'
import { IEventBusOptions, ISSL } from '../infrastructure/port/connection.factory.interface'
import { ConnectionOptions } from '@influxdata/influxdb-client'

export abstract class Config {

    /**
     * Retrieve the URI and options for connection to MongoDB.
     *
     * @return {
     *     uri: '',
     *     options: {
     *         url: '',
     *         token: '',
     *         trasportOoptions: {}
     *     }
     * }
     */
    public static getInfluxConfig(): IInfluxDBConfig {
        const uri = process.env.INFLUXDB_URL || Default.INFLUXDB_URL

        return {
            uri,
            options: {
                url: uri,
                token: process.env.INFLUXDB_TOKEN || Default.INFLUXDB_TOKEN,
                transportOptions: {
                    rejectUnauthorized: true
                }
            } as ConnectionOptions
        } as IInfluxDBConfig
    }

    /**
     * Retrieve the URI and options for connection to RabbitMQ.
     *
     * @return {
     *     uri: '',
     *     options: {
     *         retries: 0,
     *         interval: 2000,
     *         sslOptions: {
     *             cert: '',
     *             key: '',
     *             ca: [''],
     *         }
     *     }
     * }
     */
    public static getRabbitConfig(): IRabbitConfig {
        const uri = process.env.RABBITMQ_URI || Default.RABBITMQ_URI
        return {
            uri,
            options: {
                retries: 0,
                interval: 2000,
                sslOptions: uri.indexOf('amqps') !== 0 ? undefined : {
                    cert: fs.readFileSync(process.env.RABBITMQ_CERT_PATH!),
                    key: fs.readFileSync(process.env.RABBITMQ_KEY_PATH!),
                    ca: [fs.readFileSync(process.env.RABBITMQ_CA_PATH!)]
                } as ISSL
            } as IEventBusOptions
        } as IRabbitConfig
    }
}


export interface IRabbitConfig {
    uri: string
    options: IEventBusOptions
}

interface IInfluxDBConfig {
    uri: string
    options: ConnectionOptions
}
