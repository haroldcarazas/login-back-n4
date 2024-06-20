import { SECRET_KEY } from '../config/config.js'
import { pool } from '../config/db.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    const { nombres, apellidos, username, password } = req.body

    if (!nombres || !apellidos || !username || !password) return res.status(400).json({ message: 'Faltan datos para el registro' })

    const fecha = new Date()
    const [resultado] = await pool.execute(
      'INSERT INTO usuarios(nombres, apellidos, username, password, fecha_creacion) VALUES(?, ?, ?, ?, ?)',
      [nombres, apellidos, username, password, fecha.toISOString()]
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
    if (password !== usuario.password) return res.status(400).json({ message: 'Credenciales inválidas' })

    const token = jwt.sign({ usuarioId: usuario.usuario_id }, SECRET_KEY, { expiresIn: '60' })

    res.json({ message: 'Usuario autenticado', token })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
