import { inject, injectable } from 'inversify'
import { IHeartHateRepository } from '../../application/port/heart.hate.repository.interface'
import { Identifier } from '../../di/identifiers'
// import { ConnectionFactoryInfluxDB } from '../database/connection.factory.influxdb'
import { IEntityMapper } from '../entity/mapper/entity.mapper.interface'
import { HeartHate } from '../../application/domain/model/heart.hate'
import { HeartHateEntity } from '../entity/heart.hate.entity'
import { ILogger } from '../../utils/custom.logger'
import { Default } from '../../utils/default'
import { RepositoryException } from '../../application/domain/exception/repository.exception'
import { Strings } from '../../utils/strings'
import moment from 'moment'
// import { IConnectionFactoryDB } from '../port/connection.factory.interface'
import { hostname } from 'os'
import { FluxTableMetaData, InfluxDB } from '@influxdata/influxdb-client'
import { DiagnosticsChannel } from 'undici-types'
import Error = DiagnosticsChannel.Error
import { next } from 'inversify-express-utils'
// import { InfluxDB } from '@influxdata/influxdb-client'

@injectable()
export class HeartHateRepository implements IHeartHateRepository {

    constructor(
        // @inject(Identifier.INFLUXDB_CONNECTION) private readonly _db: InfluxDB,
        @inject(Identifier.HEART_HATE_MAPPER) private readonly _mapper: IEntityMapper<HeartHate, HeartHateEntity>,
        @inject(Identifier.LOGGER) protected readonly _logger: ILogger
    ) {

    }

    public create(item: HeartHate): Promise<HeartHate> {
        return new Promise((resolve, reject) => {
            try {
                const data: HeartHateEntity = this._mapper.transform(item)

                const instance: InfluxDB | undefined = new InfluxDB({
                    url: process.env.INFLUXDB_URL || Default.INFLUXDB_URL,
                    token: process.env.INFLUXDB_TOKEN || Default.INFLUXDB_TOKEN
                })

                instance.getWriteApi(process.env.INFLUXDB_ORG || Default.INFLUXDB_ORG, 'times.bucket', 'ns', {
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

    private async buildResult(type: string,
                              startTime: string, endTime: string): Promise<HeartHate> {
        return new Promise<HeartHate>(async (resolve, reject) => {
            const query: Array<string> = this.buildQuery(type, startTime, endTime)
            console.log(`query: ${query}`)
            const instance: InfluxDB | undefined = new InfluxDB({
                url: process.env.INFLUXDB_URL || Default.INFLUXDB_URL,
                token: process.env.INFLUXDB_TOKEN || Default.INFLUXDB_TOKEN
            })

            instance.getQueryApi(process.env.INFLUXDB_ORG || Default.INFLUXDB_ORG)
                .queryRows(query, {
                    next(row: string[], tableMeta: FluxTableMetaData): void  {
                        const obj = tableMeta.toObject(row)
                        console.log(
                            `${obj._measurement} in (${obj.type}): ${obj._field}=${obj._value}`
                        )
                    },
                    error(error: Error) {
                        console.error(error)
                        console.log('\nFinished ERROR')
                    },
                    complete() {
                        console.log('\nFinished SUCCESS')
                        next()
                    }
                })
                /*.then((res) => {
                    console.log(`res: ${res}`)
                    return resolve(this._mapper.transform(res))
                })
                .catch((err) => {
                    this._logger.error(err)
                    return reject(new RepositoryException(Strings.ERROR_MESSAGE.UNEXPECTED))
                })*/
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
