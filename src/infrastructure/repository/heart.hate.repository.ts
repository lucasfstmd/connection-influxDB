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
import { IConnectionFactoryDB } from '../port/connection.factory.interface'

@injectable()
export class HeartHateRepository implements IHeartHateRepository {

    constructor(
        @inject(Identifier.INFLUXDB_CONNECTION) private readonly _db: IConnectionFactoryDB,
        @inject(Identifier.HEART_HATE_MAPPER) private readonly _mapper: IEntityMapper<HeartHate, HeartHateEntity>,
        @inject(Identifier.LOGGER) protected readonly _logger: ILogger
    ) {
    }

    public create(item: HeartHate): Promise<HeartHate> {
        return new Promise((resolve, reject) => {
            try {
                const data: HeartHateEntity = this._mapper.transform(item)

                this._db.writeApi(data.points, 'heart_hate')
                    .then((res) => {
                        this._mapper.transform(res)
                    })
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
            await this._db.queryDB(query)
                .then((result) => {
                    return resolve(this._mapper.transform(result))
                })
                .catch((err) => {
                    this._logger.error(err)
                    return reject(new RepositoryException(Strings.ERROR_MESSAGE.UNEXPECTED))
                })

        })
    }

    private buildQuery(type: string,
                       startTime: string, endTime: string): Array<string> {
        return [
            `SELECT SUM(value) as value FROM ${Default.MEASUREMENT_HR_NAME}
                WHERE type = '${type}'
                AND time >= '${startTime}'
                AND time <= '${endTime}'
                GROUP BY time(1d) fill(0) ORDER BY time ASC;`,
            `SELECT SUM(value) as total FROM ${Default.MEASUREMENT_HR_NAME}
                WHERE user_id = '${type}'
                AND time >= '${startTime}'
                AND time <= '${endTime}';`
        ]
    }
}
