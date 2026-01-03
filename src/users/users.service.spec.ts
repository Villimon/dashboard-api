import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import { TYPES } from '../types';
import { User } from './user.entity';
import { UserService } from './users.service';
import { ConfigServiceType } from '../config/config.service.interface';
import { UsersRepositoryType } from './users.repository.interface';
import { UserServiceType } from './users.service.interface';

const ConfigServiceMock: ConfigServiceType = {
	get: jest.fn(),
};

const UsersRepositoryMock: UsersRepositoryType = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: ConfigServiceType;
let usersRepository: UsersRepositoryType;
let usersService: UserServiceType;

beforeAll(() => {
	container.bind<UserServiceType>(TYPES.UserService).to(UserService);
	container.bind<ConfigServiceType>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<UsersRepositoryType>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<ConfigServiceType>(TYPES.ConfigService);
	usersRepository = container.get<UsersRepositoryType>(TYPES.UsersRepository);
	usersService = container.get<UserServiceType>(TYPES.UserService);
});

let createdUser: UserModel | null;

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		createdUser = await usersService.createUser({
			email: 'a@a.ru',
			name: 'Антон',
			password: '1',
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});

	it('validateUser - success', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await usersService.validateUser({
			email: 'a@a.ru',
			password: '1',
		});
		expect(res).toBeTruthy();
	});

	it('validateUser - wrong password', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await usersService.validateUser({
			email: 'a@a.ru',
			password: '2',
		});
		expect(res).toBeFalsy();
	});

	it('validateUser - wrong user', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const res = await usersService.validateUser({
			email: 'a2@a.ru',
			password: '2',
		});
		expect(res).toBeFalsy();
	});
});
