import { inject, injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from '../types';
import { LoggerType } from '../logger/logger.interface';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.LoggerType) private logger: LoggerType) {
		// Создаем адаптер
		const adapter = new PrismaBetterSqlite3({ url: './prisma/dev.db' });

		this.client = new PrismaClient({
			adapter: adapter,
			log: [],
		});
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('[PrismaService] Успешно подключились к базе данных');
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error('[PrismaService] Ошибка подключения к базе данных' + error.message);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
