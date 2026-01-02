import { inject, injectable } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto copy';
import { User } from './user.entity';
import { UserServiceType } from './users.service.interface';
import 'reflect-metadata';
import { ConfigServiceType } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UsersRepositoryType } from './users.repository.interface';
import { UserModel } from '@prisma/client';

// Тут прописывается бизнес логика с бизнес правилами
@injectable()
export class UserService implements UserServiceType {
	constructor(
		@inject(TYPES.ConfigService) private configService: ConfigServiceType,
		@inject(TYPES.UsersRepository) private usersRepository: UsersRepositoryType,
	) {}
	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		const existedUser = await this.usersRepository.find(email);
		if (existedUser) {
			return null;
		}

		return this.usersRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.find(email);
		if (!existedUser) {
			return false;
		}
		const newUser = new User(existedUser.email, existedUser.name, existedUser.password);
		return newUser.comparePassword(password);
	}
}
