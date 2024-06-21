import express from 'express'
import { PORT } from './config/config.js'
import authRoutes from './routes/auth.routes.js'
import { validateCORS } from './middlewares/middleware.js'

const app = express()

app.use(validateCORS)
app.use(express.json())
app.use('/api/auth', authRoutes)

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
