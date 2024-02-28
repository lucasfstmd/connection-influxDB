import { IService } from './service.interface'
import { HeartHate } from '../domain/model/heart.hate'

export interface IHeartHateServiceInterface extends IService<HeartHate> {

    listAll(startDate: string, endDate): Promise<Array<HeartHate>>

    listByType(startDate: string, endDate: string, type: string): Promise<HeartHate>
}
