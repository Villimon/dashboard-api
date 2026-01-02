import type { Express } from 'express';
import type { Server } from 'http';
import express from 'express';
import { UserController } from './users/user.controller';
import { ExeptionFilters } from './errors/exeption.filter';
import { LoggerType } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import 'reflect-metadata';
import { ConfigServiceType } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.LoggerType) private logger: LoggerType,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExeptionFilter) private exeptionFilters: ExeptionFilters,
		@inject(TYPES.ConfigService) private configService: ConfigServiceType,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(express.json());
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	// Наши обработчики ошибок
	useExeptionFilters(): void {
		this.app.use(this.exeptionFilters.catch.bind(this.exeptionFilters));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
	}
}
