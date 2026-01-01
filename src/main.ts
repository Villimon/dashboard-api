import { Container, ContainerModule } from 'inversify';
import { App } from './app';
import { ExeptionFilters } from './errors/exeption.filter';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/user.controller';
import { LoggerType } from './logger/logger.interface';
import { TYPES } from './types';
import { ExeptionFilter } from './errors/exeption.filter.interface';
import { UserControllerType } from './users/user.controller.interface';
import { UserServiceType } from './users/users.service.interface';
import { UserService } from './users/users.service';
import { ConfigServiceType } from './config/config.service.interface';
import { ConfigService } from './config/config.service';

export interface BootstrapReturn {
	app: App;
	appContainer: Container;
}

export const appBindings = new ContainerModule((bind) => {
	bind.bind<LoggerType>(TYPES.LoggerType).to(LoggerService).inSingletonScope();
	bind.bind<ExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilters);
	bind.bind<UserControllerType>(TYPES.UserController).to(UserController);
	bind.bind<UserServiceType>(TYPES.UserService).to(UserService);
	// Создается один раз и передается этот инстенс в другие места
	bind.bind<ConfigServiceType>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind.bind<App>(TYPES.Application).to(App);
});

function bootstrap(): BootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();

/* 
import express from 'express'
import type { Request, Response, NextFunction} from 'express'

import { router as userRouter } from './users/users.js'


const port = 8000
const app = express()


app.use((req, res, next) => {
    console.log('Время', Date.now());
    next()
})


app.get('/hello', (req, res) => {
    throw new Error("Error");
    
    // res.send('Hello')
})

app.use('/users', userRouter)

// Этот мидлвеер должен быть в самом конце, он является обработчиком ошибок, он ловит ошибки во всех роутах и возвращает клиенту понятную ошибку
app.use((err: Error, req: Request, res:Response, next:NextFunction) => {
    console.log(err.message);
    res.status(500).send(err.message)
})

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
})



*/
