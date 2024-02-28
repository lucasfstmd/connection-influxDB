import { Point } from '@influxdata/influxdb-client'

export class HeartHateEntity {
    constructor(public points: Array<Point>) {
        this.points = points
    }
}
