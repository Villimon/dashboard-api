import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { LoggerType } from '../logger/logger.interface';
import 'reflect-metadata';
import { UserControllerType } from './user.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto copy';
import { UserServiceType } from './users.service.interface';
import { ValidateMiddleware } from './validate.middleware';

// Тут хранится только работа с API и возвращение ответов
// То есть получаем данные, приобразовываем и передаем в бизнес
// Работа с входными данными и выходными
@injectable()
export class UserController extends BaseController implements UserControllerType {
	constructor(
		@inject(TYPES.LoggerType) private loggerService: LoggerType,
		@inject(TYPES.UserService) private userServive: UserServiceType,
	) {
		super(loggerService);
		this.bindRouter([
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
		]);
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userServive.validateUser(body);
		if (!result) {
			return next(new HTTPError(401, 'Ошибка авторизации', 'login'));
		}
		this.ok(res, 'Успешная авторизация');
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userServive.createUser(body);
		if (!result) {
			return next(new HTTPError(422, 'Такой пользователь уже существует', 'register'));
		}
		this.ok(res, { email: result.email, id: result.id });
	}
}
