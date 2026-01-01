import { NextFunction, Request, Response } from "express";
import { ExeptionFilter } from "./exeption.filter.interface";
import { HTTPError } from "./http-error.class";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { LoggerType } from "../logger/logger.interface";
import 'reflect-metadata'

@injectable()
export class ExeptionFilters implements ExeptionFilter {
    constructor(@inject(TYPES.LoggerType) private logger: LoggerType){}
    
    catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction) {
        if(err instanceof HTTPError) {
            this.logger.error(`[${err.context}] Ошибка ${err.statusCode}: ${err.message}`)
            res.status(err.statusCode).send(`${err.message}`)
        } else {
            this.logger.error(`${err.message}`)
            res.status(500).send(`${err.message}`)
        }
    }
}