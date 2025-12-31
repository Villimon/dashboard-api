import { NextFunction, Request, Response } from "express";
import { LoggerService } from "../logger/logger.service";
import { ExeptionFilter } from "./exeption.filter.interface";
import { HTTPError } from "./http-error.class";


export class ExeptionFilters implements ExeptionFilter {
    logger: LoggerService

    constructor(logger: LoggerService){
        this.logger = logger
    }
    
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