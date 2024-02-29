import { injectable } from 'inversify'
import { IEntityMapper } from './entity.mapper.interface'
import { HeartHate } from '../../../application/domain/model/heart.hate'
import { HeartHateEntity } from '../heart.hate.entity'
import { Point } from '@influxdata/influxdb-client'
import { Default } from '../../../utils/default'
import { Item } from '../../../application/domain/model/item'

@injectable()
export class HeartHateMapper implements IEntityMapper<HeartHate, HeartHateEntity> {

    public transform(item: any): any {
        if (item instanceof HeartHate) return this.modelToModelEntity(item)
    }

    public jsonToModel(json: any): HeartHate {
        const result: HeartHate = new HeartHate()
        if (!json) return result

        if (json.min !== undefined) result.min = json.min
        if (json.max !== undefined) result.max = json.max
        if (json.duration !== undefined) result.duration = json.duration
        if (json.type !== undefined) result.type = json.type
        if (json.data_set !== undefined) {
            result.dataSet = json.data_set.map((item: any) => new Item().fromJSON(item))
        }

        return result
    }

    public modelToModelEntity(item: HeartHate): HeartHateEntity {
        return new HeartHateEntity(this.buildPoints(item))
    }

    private buildPoints(item: HeartHate): Array<Point> {
        return item?.dataSet?.map((entity: any) => {
            const point: Point = new Point(Default.MEASUREMENT_HR_NAME)
            point.fields = { value: `${entity.value}` }
            point.tag('type', item.type!)
                .timestamp(new Date(entity.date).getTime() * 1e+6)

            return point
        })
    }
}
