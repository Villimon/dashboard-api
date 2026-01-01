import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { ConfigServiceType } from './config.service.interface';
import { LoggerType } from '../logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

@injectable()
export class ConfigService implements ConfigServiceType {
	private config: DotenvParseOutput;
	constructor(@inject(TYPES.LoggerType) private logger: LoggerType) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error('[ConfigService] Не удалось прочитать файл .env');
		} else {
			this.logger.log('[ConfigService] Конфигурация .env загружена');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
