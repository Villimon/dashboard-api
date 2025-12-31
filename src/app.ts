import type { Express } from 'express'
import type { Server } from 'http'
import express from 'express'
import { LoggerService } from './logger/logger.service'
import { UserController } from './users/user.controller'
import { ExeptionFilters } from './errors/exeption.filter'

export class App {
    app: Express
    server: Server
    port: number
    logger: LoggerService
    userController: UserController
    exeptionFilters: ExeptionFilters

    constructor(logger: LoggerService, userController: UserController, exeptionFilters: ExeptionFilters) {
        this.app = express()
        this.port = 8000
        this.logger = logger
        this.userController = userController
        this.exeptionFilters = exeptionFilters
    }

    useRoutes() {
        this.app.use('/users', this.userController.router)
    }

    // Наши обработчики ошибок
    useExeptionFilters() {
        this.app.use(this.exeptionFilters.catch.bind(this.exeptionFilters))
    }

    public async init() {
        this.useRoutes()
        this.useExeptionFilters()
        this.server = this.app.listen(this.port)
        this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
    }
}