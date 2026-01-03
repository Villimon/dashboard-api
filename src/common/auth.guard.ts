import { Request, Response, NextFunction } from 'express';
import { MiddleWareType } from './middleware.interface';

export class AuthGuard implements MiddleWareType {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.user) {
			return next();
		}
		res.status(401).send({ error: 'Вы не авторизованы' });
	}
}
