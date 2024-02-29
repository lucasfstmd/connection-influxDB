import { IHeartHateService } from '../port/heart.hate.service.interface'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IHeartHateRepository } from '../port/heart.hate.repository.interface'
import { HeartHate } from '../domain/model/heart.hate'

@injectable()
export class HeartHateService implements IHeartHateService {

    constructor(
        @inject(Identifier.HEART_HATE_REPOSITORY) private readonly _repository: IHeartHateRepository,
    ) {
    }

    public add(item: HeartHate): Promise<HeartHate> {
        try {
            return this._repository.create(item)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public listByType(startDate: string, endDate: string, type: string): Promise<HeartHate> {
        try {
            startDate = this.buildDate(startDate)
            endDate = this.buildDate(endDate)

            return this._repository.listByType(startDate, endDate, type)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    private buildDate(date: string): string {
        return date === 'today' ? this.generateDate() : date
    }

    private generateDate(): string {
        const date = new Date()
        const year = String(date.getFullYear())
        let month = String(date.getMonth() + 1)
        let day = String(date.getDate())

        if (month.length === 1) month = month.padStart(2, '0')
        if (day.length === 1) day = day.padStart(2, '0')

        return [year, month, day].join('-')
    }
}
