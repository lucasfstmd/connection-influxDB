export abstract class Identifier {
    public static readonly APP: any = Symbol.for('App')

    // Controllers
    public static readonly HOME_CONTROLLER: any = Symbol.for('HomeController')
    public static readonly HEART_HATE_CONTROLLER: any = Symbol.for('HeartHateController')

    // Services
    public static readonly HEART_HATE_SERVICE: any = Symbol.for('HeartHateService')

    // Repositories
    public static readonly INFLUXDB_CONNECTION_FACTORY: any = Symbol.for('ConnectionFactoryInfluxDB')
    public static readonly INFLUXDB_CONNECTION: any = Symbol.for('ConnectionInfluxDB')
    public static readonly HEART_HATE_REPOSITORY: any = Symbol.for('HeartHateRepository')

    // Mappers
    public static readonly HEART_HATE_MAPPER: any = Symbol.for('HeartHateMapper')

    // Background Services
    public static readonly BACKGROUND_SERVICE: any = Symbol.for('BackgroundService')
    public static readonly RABBITMQ_EVENT_BUS: any = Symbol.for('EventBusRabbitMQ')
    public static readonly RABBITMQ_CONNECTION_FACTORY: any = Symbol.for('RabbitMQConnectionFactory')
    public static readonly RABBITMQ_CONNECTION: any = Symbol.for('RabbitMQConnection')

    // Tasks
    public static readonly REGISTER_SETTINGS_TASK: any = Symbol.for('RegisterSettingsTask')
    public static readonly PUBLISH_EVENT_BUS_TASK: any = Symbol.for('PublishEventBusTask')
    public static readonly SUBSCRIBE_EVENT_BUS_TASK: any = Symbol.for('SubscribeEventBusTask')
    public static readonly RPC_SERVER_EVENT_BUS_TASK: any = Symbol.for('RpcServerEventBusTask')

    // Log
    public static readonly LOGGER: any = Symbol.for('CustomLogger')
}
