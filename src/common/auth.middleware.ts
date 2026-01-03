import { Request, Response, NextFunction } from 'express';
import { MiddleWareType } from './middleware.interface';
import { JwtPayload, verify } from 'jsonwebtoken';

export interface CustomJwtPayload extends JwtPayload {
	email?: string;
}

export class AuthMiddleware implements MiddleWareType {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			verify(token, this.secret, (err, payload) => {
				if (err) {
					next();
				} else if (payload && typeof payload !== 'string') {
					const customPayload = payload as CustomJwtPayload;
					req.user = customPayload.email ? customPayload.email : '';
					next();
				}
			});
		} else {
			next();
		}
	}
}
