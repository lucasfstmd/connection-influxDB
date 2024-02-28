import { injectable } from 'inversify'
import { IEntityMapper } from './entity.mapper.interface'
import { HeartHate } from '../../../application/domain/model/heart.hate'
import { HeartHateEntity } from '../heart.hate.entity'

@injectable()
export class HeartHateMapper implements IEntityMapper<HeartHate, HeartHateEntity> {
    public transform(item: any): any {
        if (item instanceof HeartHate) return this.modelToModelEntity(item)
    }

    public jsonToModel(json: any): HeartHate {
        const result: HeartHate = new HeartHate()
        if (!json) return result

        if (json.date !== undefined) result.date = json.date
        if (json.value !== undefined) result.value = json.value
        if (json.min !== undefined) result.min = json.min
        if (json.max !== undefined) result.max = json.max
        if (json.duration !== undefined) result.duration = json.duration
        if (json.type !== undefined) result.type = json.type

        return result
    }

    modelToModelEntity(item: HeartHate): HeartHateEntity {
        const result: HeartHateEntity = new HeartHateEntity()

        if (item.date !== undefined) result.date = item.date
        if (item.value !== undefined) result.value = item.value
        if (item.min !== undefined) result.min = item.min
        if (item.max !== undefined) result.max = item.max
        if (item.duration !== undefined) result.duration = item.duration
        if (item.type !== undefined) result.type = item.type

        return result
    }
}
