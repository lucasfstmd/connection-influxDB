import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils'
import { inject } from 'inversify'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { IHeartHateService } from '../../application/port/heart.hate.service.interface'
import { HeartHate } from '../../application/domain/model/heart.hate'
import { ApiExceptionManager } from '../exception/api.exception.manager'

@controller('/v1/timeseries')
export class HeartHateController {

    constructor(
        @inject(Identifier.HEART_HATE_SERVICE) private readonly _service: IHeartHateService,
    ) {
    }

    @httpGet('/date/:start_date/:end_date/:type')
    public async getTimeSeriesByType(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: HeartHate = await this._service
                .listByType(req.params.start_date, req.params.end_date, req.params.type)


            return res.status(200).send(result)
        } catch (err: any) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code)
                .send(handleError.toJSON())
        }
    }

    @httpPost('/create')
    public async create(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const item: HeartHate = await this._service.add(new HeartHate().fromJSON(req.body))

            return res.status(200).send(item)
        } catch (err: any) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code)
                .send(handleError.toJSON())
        }
    }
}
