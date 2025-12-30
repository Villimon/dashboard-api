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
