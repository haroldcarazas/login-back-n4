import { allowedOrigins } from '../config/config.js'

export const validateCORS = (req, res, next) => {
  const { origin } = req.headers

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
  } else {
    res.status(500).json({ message: 'Origen no permitido' })
  }
}
