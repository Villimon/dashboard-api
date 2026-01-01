import type { Express } from 'express'
import type { Server } from 'http'
import express from 'express'
import { UserController } from './users/user.controller'
import { ExeptionFilters } from './errors/exeption.filter'
import { LoggerType } from './logger/logger.interface'
import { inject, injectable } from 'inversify'
import { TYPES } from './types'
import 'reflect-metadata'


@injectable()
export class App {
    app: Express
    server: Server
    port: number

    constructor(
        @inject(TYPES.LoggerType) private logger: LoggerType,
        @inject(TYPES.UserController) private userController: UserController,
        @inject(TYPES.ExeptionFilter) private exeptionFilters: ExeptionFilters
    ) {
        this.app = express()
        this.port = 8000
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