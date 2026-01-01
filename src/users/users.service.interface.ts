import { UserRegisterDto } from './dto/user-register.dto copy';
import { User } from './user.entity';
import { UserLoginDto } from './dto/user-login.dto';

export interface UserServiceType {
	createUser: (dto: UserRegisterDto) => Promise<User | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
