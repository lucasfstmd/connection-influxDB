import { Container } from 'inversify'
import { Identifier } from './identifiers'
import { App } from '../app'
import { CustomLogger, ILogger } from '../utils/custom.logger'
import { BackgroundService } from '../background/background.service'
import { IConnectionFactory, IConnectionFactoryDB } from '../infrastructure/port/connection.factory.interface'
import { IBackgroundTask } from '../application/port/background.task.interface'
import { RegisterTask } from '../background/task/register.task'
import { HomeController } from '../ui/controllers/home.controller'
import { EventBusRabbitMQ } from '../infrastructure/eventbus/rabbitmq/eventbus.rabbitmq'
import { IEventBus } from '../infrastructure/port/event.bus.interface'
import { ConnectionFactoryRabbitMQ } from '../infrastructure/eventbus/rabbitmq/connection.factory.rabbitmq'
import { ConnectionRabbitMQ } from '../infrastructure/eventbus/rabbitmq/connection.rabbitmq'
import { IConnectionEventBus } from '../infrastructure/port/connection.event.bus.interface'
import { RpcServerEventBusTask } from '../background/task/rpc.server.event.bus.task'
import { PublishEventBusTask } from '../background/task/publish.event.bus.task'
import { SubscribeEventBusTask } from '../background/task/subscribe.event.bus.task'
import { ConnectionFactoryInfluxDB } from '../infrastructure/database/connection.factory.influxdb'
import { ConnectionInfluxDB } from '../infrastructure/database/connection.influxdb'
import { IConnectionDB } from '../infrastructure/port/connection.db.interface'
import { IEntityMapper } from '../infrastructure/entity/mapper/entity.mapper.interface'
import { HeartHate } from '../application/domain/model/heart.hate'
import { HeartHateEntity } from '../infrastructure/entity/heart.hate.entity'
import { HeartHateMapper } from '../infrastructure/entity/mapper/heart.hate.mapper'
import { IHeartHateRepository } from '../application/port/heart.hate.repository.interface'
import { HeartHateRepository } from '../infrastructure/repository/heart.hate.repository'
import { IHeartHateService } from '../application/port/heart.hate.service.interface'
import { HeartHateService } from '../application/service/heart.hate.service'
import { HeartHateController } from '../ui/controllers/heart.hate.controller'

class IoC {
    private readonly _container: Container

    /**
     * Creates an instance of Di.
     *
     * @private
     */
    constructor() {
        this._container = new Container()
        this.initDependencies()
    }

    /**
     * Get Container inversify.
     *
     * @returns {Container}
     */
    get container(): Container {
        return this._container
    }

    private initDependencies(): void {
        this._container.bind(Identifier.APP).to(App).inSingletonScope()

        // Controllers
        this._container.bind<HomeController>(Identifier.HOME_CONTROLLER).to(HomeController).inSingletonScope()
        this._container.bind<HeartHateController>(Identifier.HEART_HATE_CONTROLLER).to(HeartHateController).inSingletonScope()

        // Mappers
        this._container
            .bind<IEntityMapper<HeartHate, HeartHateEntity>>(Identifier.HEART_HATE_MAPPER)
            .to(HeartHateMapper).inSingletonScope()

        // Services
        this._container.bind<IHeartHateService>(Identifier.HEART_HATE_SERVICE)
            .to(HeartHateService).inSingletonScope()

        // Repositors
        this._container.bind<IHeartHateRepository>(Identifier.HEART_HATE_REPOSITORY)
            .to(HeartHateRepository).inSingletonScope()

        // Background Services
        this._container
            .bind<IConnectionFactory>(Identifier.RABBITMQ_CONNECTION_FACTORY)
            .to(ConnectionFactoryRabbitMQ).inSingletonScope()
        this._container
            .bind<IConnectionDB>(Identifier.INFLUXDB_CONNECTION)
            .to(ConnectionInfluxDB).inSingletonScope()
        this._container
            .bind<IConnectionEventBus>(Identifier.RABBITMQ_CONNECTION)
            .to(ConnectionRabbitMQ)
        this._container
            .bind<IEventBus>(Identifier.RABBITMQ_EVENT_BUS)
            .to(EventBusRabbitMQ).inSingletonScope()
        this._container
            .bind(Identifier.BACKGROUND_SERVICE)
            .to(BackgroundService).inSingletonScope()
        this._container
            .bind<IConnectionFactoryDB>(Identifier.INFLUXDB_CONNECTION_FACTORY)
            .to(ConnectionFactoryInfluxDB).inSingletonScope()

        // Tasks
        this._container
            .bind<IBackgroundTask>(Identifier.REGISTER_SETTINGS_TASK)
            .to(RegisterTask).inRequestScope()
        this._container
            .bind<IBackgroundTask>(Identifier.PUBLISH_EVENT_BUS_TASK)
            .to(PublishEventBusTask).inRequestScope()
        this._container
            .bind<IBackgroundTask>(Identifier.SUBSCRIBE_EVENT_BUS_TASK)
            .to(SubscribeEventBusTask).inRequestScope()
        this._container
            .bind<IBackgroundTask>(Identifier.RPC_SERVER_EVENT_BUS_TASK)
            .to(RpcServerEventBusTask).inRequestScope()

        // Log
        this._container.bind<ILogger>(Identifier.LOGGER).to(CustomLogger).inSingletonScope()

    }
}

export const DIContainer = new IoC().container
