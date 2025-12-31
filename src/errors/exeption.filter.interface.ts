import { NextFunction, Request, Response } from "express";

export interface ExeptionFilter {
    catch:(err: Error, req: Request, res: Response, next: NextFunction) => void
}