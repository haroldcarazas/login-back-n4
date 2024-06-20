import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config/config.js'

export const validateJWT = (req, res, next) => {
  try {
    const { authorization } = req.headers

    if (!authorization) return res.status(400).json({ message: 'Debes enviar un token' })

    jwt.verify(authorization, SECRET_KEY)
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) return res.status(400).json({ message: 'Token expirado' })

    return res.status(500).json({ message: 'Error interno en el token' })
  }
}
