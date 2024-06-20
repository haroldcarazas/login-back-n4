import { SECRET_KEY } from '../config/config.js'
import { pool } from '../config/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const register = async (req, res) => {
  try {
    const { nombres, apellidos, username, password } = req.body

    if (!nombres || !apellidos || !username || !password) return res.status(400).json({ message: 'Faltan datos para el registro' })

    // Encriptar la contraseña
    const hash = await bcrypt.hash(password, 10)

    const fecha = new Date()
    const [resultado] = await pool.execute(
      'INSERT INTO usuarios(nombres, apellidos, username, password, fecha_creacion) VALUES(?, ?, ?, ?, ?)',
      [nombres, apellidos, username, hash, fecha.toISOString()]
    )

    if (resultado.affectedRows !== 1) return res.status(400).json({ message: 'Error al insertar el registro' })

    res.json({ message: 'Usuario registrado con éxito' })
  } catch (error) {
    if (error?.errno === 1062) return res.status(400).json({ message: 'El nombre de usuario ya existe' })
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { username, password } = req.body

    const [resultado] = await pool.execute('SELECT * FROM usuarios WHERE username=?', [username])
    if (resultado.length === 0) return res.status(400).json({ message: 'Usuario no encontrado' })

    const usuario = resultado[0]

    // Comparar la contraseña del usuario en la bd con el intento en el frontend
    const match = await bcrypt.compare(password, usuario.password)
    if (!match) return res.status(400).json({ message: 'Credenciales inválidas' })

    const token = jwt.sign({ usuarioId: usuario.usuario_id }, SECRET_KEY, { expiresIn: '5m' })

    res.json({ message: 'Usuario autenticado', token })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const me = async (req, res) => {
  try {
    const { authorization } = req.headers
    const { usuarioId } = jwt.verify(authorization, SECRET_KEY)
    const [resultado] = await pool.execute(
      'SELECT usuario_id, nombres, apellidos, telefono, username FROM usuarios WHERE usuario_id=?',
      [usuarioId]
    )
    res.json(resultado[0])
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) return res.status(400).json({ message: 'Token expirado' })
    res.status(500).json({ message: error.message })
  }
}
