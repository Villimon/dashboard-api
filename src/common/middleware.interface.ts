import { NextFunction, Request, Response } from 'express';

export interface MiddleWareType {
	execute: (req: Request, res: Response, next: NextFunction) => void;
}
