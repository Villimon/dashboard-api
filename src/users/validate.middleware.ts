import { Request, Response, NextFunction } from 'express';
import { MiddleWareType } from '../common/middleware.interface';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class ValidateMiddleware implements MiddleWareType {
	constructor(private classToValidate: ClassConstructor<Object>) {}

	// body приобразовываем в класс, того типа класс, который мы передали и валидируем
	execute({ body }: Request, res: Response, next: NextFunction): void {
		const instance = plainToClass(this.classToValidate, body);
		validate(instance).then((errors) => {
			if (errors.length > 0) {
				res.status(422).send(errors);
			} else {
				next();
			}
		});
	}
}
