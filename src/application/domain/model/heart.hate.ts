import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { Item } from './item'

export class HeartHate implements IJSONSerializable, IJSONDeserializable<HeartHate> {
    private _min: number
    private _max: number
    private _duration: number
    private _type: string
    private _dataSet: Array<Item>


    constructor(min?: number,
                max?: number,
                duration?: number,
                type?: string,
                dataSet?: Array<Item>) {
        this._min = min !== undefined ? min : 0
        this._max = max !== undefined ? max : 0
        this._duration = duration !== undefined ? duration : 0
        this._type = type ? type : ''
        this._dataSet = dataSet ? dataSet : []
    }

    get min(): number {
        return this._min
    }

    set min(value: number) {
        this._min = value
    }

    get max(): number {
        return this._max
    }

    set max(value: number) {
        this._max = value
    }

    get duration(): number {
        return this._duration
    }

    set duration(value: number) {
        this._duration = value
    }

    get type(): string {
        return this._type
    }

    set type(value: string) {
        this._type = value
    }

    get dataSet(): Array<Item> {
        return this._dataSet
    }

    set dataSet(value: Array<Item>) {
        this._dataSet = value
    }

    public toJSON(): any {
        return {
            min: this.min,
            max: this.max,
            duration: this.duration,
            type: this.type,
            data_set: this.dataSet?.map(item => item.toJSON())
        }
    }
    public fromJSON(json: any): HeartHate {
        if (!json) return this

        if (json.min) this.min = json.min
        if (json.max) this.max = json.max
        if (json.duration) this.duration = json.duration
        if (json.type) this.type = json.type
        if (json.data_set) this.dataSet = json.data_set.map(item => new Item().fromJSON(item))
        return this
    }
}
