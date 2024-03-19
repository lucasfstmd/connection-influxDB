import { inject, injectable } from 'inversify'
import { IHeartHateRepository } from '../../application/port/heart.hate.repository.interface'
import { Identifier } from '../../di/identifiers'
import { IEntityMapper } from '../entity/mapper/entity.mapper.interface'
import { HeartHate } from '../../application/domain/model/heart.hate'
import { HeartHateEntity } from '../entity/heart.hate.entity'
import { ILogger } from '../../utils/custom.logger'
import { Default } from '../../utils/default'
import { RepositoryException } from '../../application/domain/exception/repository.exception'
import { Strings } from '../../utils/strings'
import moment from 'moment'
import { hostname } from 'os'
import { FluxTableMetaData } from '@influxdata/influxdb-client'
import { DiagnosticsChannel } from 'undici-types'
import { Item } from '../../application/domain/model/item'
import Error = DiagnosticsChannel.Error
import { IConnectionFactoryDB } from '../port/connection.factory.interface'


@injectable()
export class HeartHateRepository implements IHeartHateRepository {

    constructor(
        @inject(Identifier.INFLUXDB_CONNECTION_FACTORY) private readonly _db: IConnectionFactoryDB,
        @inject(Identifier.HEART_HATE_MAPPER) private readonly _mapper: IEntityMapper<HeartHate, HeartHateEntity>,
        @inject(Identifier.LOGGER) protected readonly _logger: ILogger
    ) {

    }

    public create(item: HeartHate): Promise<HeartHate> {
        return new Promise((resolve, reject) => {
            try {
                const data: HeartHateEntity = this._mapper.transform(item)

                /*const instance: InfluxDB | undefined = new InfluxDB({
                    url: process.env.INFLUXDB_URL || Default.INFLUXDB_URL,
                    token: process.env.INFLUXDB_TOKEN || Default.INFLUXDB_TOKEN
                })*/

                this._db.createConnection().getWriteApi(process.env.INFLUXDB_ORG || Default.INFLUXDB_ORG, 'times.bucket', 'ns', {
                    defaultTags: {
                        services: 'timeseries',
                        host: hostname()
                    }
                }).writePoints(data.points)


                resolve(item)
            } catch (err: any) {
                this._logger.error(err)
                return reject(new RepositoryException(Strings.ERROR_MESSAGE.UNEXPECTED))
            }
        })
    }

    public async listByType(startDate: string, endDate: string, type: string): Promise<HeartHate> {

        const startTime = moment(`${startDate}T00:00:00`).format(`YYYY-MM-DDTHH:mm:ss.SSS[Z]`)
        const endTime = moment(`${endDate}T23:59:59`).format(`YYYY-MM-DDTHH:mm:ss.SSS[Z]`)

        return this.buildResult(type, startTime, endTime)
    }

    private async buildResult(type: string, startTime: string, endTime: string): Promise<HeartHate> {
        const query: Array<string> = this.buildQuery(type, startTime, endTime)

        const heart: HeartHate = new HeartHate()
        let max = 0

        console.log(query)

        return new Promise<HeartHate>((resolve, reject) => {
            this._db.createConnection().getQueryApi(process.env.INFLUXDB_ORG || Default.INFLUXDB_ORG)
                .queryRows(query, {
                    next(row: string[], tableMeta: FluxTableMetaData): void  {
                        const obj = tableMeta.toObject(row)
                        const item: Item = new Item()
                        let min = obj._value
                        heart.type = obj.type
                        item.value = obj._value
                        if (item.value > max) {
                            max = item.value
                        }
                        if (item.value < min) {
                            min = item.value
                        }
                        item.date = obj._time
                        heart.min = min
                        heart.max = max

                        const startDate = new Date(obj._start)
                        const stopDate = new Date(obj._stop)

                        const durationInMilliseconds = stopDate.getTime() - startDate.getTime()
                        heart.duration = durationInMilliseconds / (1000 * 3600 * 24)

                        heart.dataSet.push(item)
                    },
                    error(error: Error) {
                        console.error(error)
                        console.log('\nFinished ERROR')
                        reject(error)
                    },
                    complete() {
                        console.log('\nFinished SUCCESS')
                        resolve(heart)
                    }
                })
        })
    }



    private buildQuery(type: string,
                       startTime: string, endTime: string): Array<string> {
        return [
            `from(bucket: "times.bucket")
                |> range(start: ${startTime}, stop: ${endTime})
                |> filter(fn: (r) => r["_measurement"] == "times.bucket")
                |> filter(fn: (r) => r["type"] == "${type}")`
        ]
    }
}
