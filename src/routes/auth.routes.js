import { Router } from 'express'
import { login, me, register } from '../controllers/auth.controller.js'
import { validateJWT } from '../middlewares/jwt.middleware.js'

const router = Router()

router.get('/me', validateJWT, me)
router.post('/register', register)
router.post('/login', login)

export default router
