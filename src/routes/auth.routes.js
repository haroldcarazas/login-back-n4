import { Router } from 'express'
import { login, me, register } from '../controllers/auth.controller.js'

const router = Router()

router.get('/me', me)
router.post('/register', register)
router.post('/login', login)

export default router
