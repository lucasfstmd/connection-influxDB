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
import { Point } from '@influxdata/influxdb-client'
import { IDatabase } from '../port/database.interface'


@injectable()
export class HeartHateRepository implements IHeartHateRepository {

    constructor(
        @inject(Identifier.INFLUXDB_CONNECTION) private readonly _db: IDatabase,
        @inject(Identifier.HEART_HATE_MAPPER) private readonly _mapper: IEntityMapper<HeartHate, HeartHateEntity>,
        @inject(Identifier.LOGGER) protected readonly _logger: ILogger
    ) {

    }

    public create(item:  HeartHate): Promise<HeartHate> {
        return new Promise((resolve, reject) => {

            try {
                if (!this._db.connection) {
                    throw new RepositoryException(Strings.ERROR_MESSAGE.UNEXPECTED)
                }
                // Preparing the measure to be entered all at once
                const data: HeartHateEntity = this._mapper.transform(item)
                const points: Array<Point> = []
                points.push(...data.points)


                this._db.connection?.getWriteApi(process.env.INFLUXDB_ORG || Default.INFLUXDB_ORG,
                    Default.INFLUXDB_BUCKET, 'ns').writePoints(points)

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

        return new Promise<HeartHate>((resolve, reject) => {
            this._db.connection?.getQueryApi(process.env.INFLUXDB_ORG || Default.INFLUXDB_ORG)
                .collectRows(query).then((result) => {
                    return resolve(this._mapper.transform(result))
            }).catch((err) => {
                this._logger.error(err)
                return reject(new RepositoryException(Strings.ERROR_MESSAGE.UNEXPECTED))
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
