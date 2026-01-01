import { NextFunction, Request, Response, Router } from 'express';
import { MiddleWareType } from './middleware.interface';

export interface Route {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	middlewares?: MiddleWareType[];
}
