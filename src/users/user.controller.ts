import { NextFunction, Request, Response } from "express";
import { BaseController } from "../common/base.controller";
import { HTTPError } from "../errors/http-error.class";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { LoggerType } from "../logger/logger.interface";
import 'reflect-metadata'
import { UserControllerType } from "./user.controller.interface";


@injectable()
export class UserController extends BaseController implements UserControllerType {
    constructor(@inject(TYPES.LoggerType) private loggerService: LoggerType) {
        super(loggerService)
        this.bindRouter([
            {path: '/login', method: 'post', func: this.login},
            {path: '/register', method: 'post', func: this.register},
        ])
    }

    login(req: Request, res: Response, next: NextFunction) {
        next(new HTTPError(401, 'Ошибка авторизации', 'login'))
        // this.ok(res, 'login')
    }

    register(req: Request, res: Response, next: NextFunction) {
        this.ok(res, 'register')
    }
}