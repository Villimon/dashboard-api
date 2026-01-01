import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { LoggerType } from '../logger/logger.interface';
import 'reflect-metadata';
import { UserControllerType } from './user.controller.interface';
import fs from 'fs';
import { resolve } from 'path';

const data = [];

@injectable()
export class UserController extends BaseController implements UserControllerType {
	constructor(@inject(TYPES.LoggerType) private loggerService: LoggerType) {
		super(loggerService);
		this.bindRouter([
			{ path: '/login', method: 'post', func: this.login },
			{ path: '/register', method: 'post', func: this.register },
		]);
	}

	login(req: Request, res: Response, next: NextFunction): void {
		// next(new HTTPError(401, 'Ошибка авторизации', 'login'));
		this.ok(res, 'login');
	}

	register(req: Request, res: Response, next: NextFunction): void {
		data.push(fs.readFileSync(resolve(__dirname, '../../test.mp4')));
		this.ok(res, 'register');
	}
}
