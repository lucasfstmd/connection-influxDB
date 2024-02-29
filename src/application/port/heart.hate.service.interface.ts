import { IService } from './service.interface'
import { HeartHate } from '../domain/model/heart.hate'

export interface IHeartHateService extends IService<HeartHate> {
    listByType(startDate: string, endDate: string, type: string): Promise<HeartHate>
}
