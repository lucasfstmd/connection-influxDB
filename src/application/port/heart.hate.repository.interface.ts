import { IRepository } from './repository.interface'
import { HeartHate } from '../domain/model/heart.hate'

export interface IHeartHateRepositoryInterface extends IRepository<HeartHate> {

    listByType(startDate: string, endDate: string, type: string): Promise<HeartHate>
}
