import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'

export class HeartHate implements IJSONSerializable, IJSONDeserializable<HeartHate> {
    private _date: string | undefined
    private _value: number | undefined
    private _min: number | undefined
    private _max: number | undefined
    private _duration: number | undefined
    private _type: string | undefined


    get date(): string | undefined {
        return this._date
    }

    set date(value: string | undefined) {
        this._date = value
    }

    get value(): number | undefined {
        return this._value
    }

    set value(value: number | undefined) {
        this._value = value
    }

    get min(): number | undefined {
        return this._min
    }

    set min(value: number | undefined) {
        this._min = value
    }

    get max(): number | undefined {
        return this._max
    }

    set max(value: number | undefined) {
        this._max = value
    }

    get duration(): number | undefined {
        return this._duration
    }

    set duration(value: number | undefined) {
        this._duration = value
    }

    get type(): string | undefined {
        return this._type
    }

    set type(value: string | undefined) {
        this._type = value
    }
    
    public toJSON(): any {
        return {
            date: this.date,
            value: this.value,
            min: this.min,
            max: this.max,
            duration: this.duration,
            type: this.type,
        }
    }
    
    public fromJSON(json: any): HeartHate {
        if (!json) return this
        
        if (json.date) this.date = json.date
        if (json.value) this.value = json.value
        if (json.min) this.min = json.min
        if (json.max) this.max = json.max
        if (json.duration) this.duration = json.duration
        if (json.type) this.type = json.type
        return this
    }
}
