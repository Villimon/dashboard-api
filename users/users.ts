import express from 'express'


const router = express.Router()

// Работает только для этого роута
router.use((req, res, next) => {
    console.log('Обработчик users');
    next()
})


router.post('/login', (req, res) => {
    res.send('login')
})

router.post('/register', (req, res) => {
    res.send('register')
})

export { router }