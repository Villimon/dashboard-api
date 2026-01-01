import { inject, injectable } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto copy';
import { User } from './user.entity';
import { UserServiceType } from './users.service.interface';
import 'reflect-metadata';
import { ConfigServiceType } from '../config/config.service.interface';
import { TYPES } from '../types';

// Тут прописывается бизнес логика с бизнес правилами
@injectable()
export class UserService implements UserServiceType {
	constructor(@inject(TYPES.ConfigService) private configService: ConfigServiceType) {}
	async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');
		console.log(salt);

		await newUser.setPassword(password, Number(salt));
		// Проверка что есть
		// Если существует то вернем null
		// Если нет, то создаем
		return null;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
