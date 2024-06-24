import { pool } from '../config/db.js'
import bcrypt from 'bcrypt'

const create = async (nombres, apellidos, username, password) => {
  const hash = await bcrypt.hash(password, 10)
  const fecha = new Date()
  const [resultado] = await pool.execute(
    'INSERT INTO usuarios(nombres, apellidos, username, password, fecha_creacion) VALUES(?, ?, ?, ?, ?)',
    [nombres, apellidos, username, hash, fecha.toISOString()]
  )

  return resultado
}

const where = async (columna, valor) => {
  const [resultado] = await pool.execute(`SELECT * FROM usuarios WHERE ${columna}=?`, [valor])
  return resultado
}

const findById = async (usuarioId) => {
  const [resultado] = await pool.execute(
    'SELECT usuario_id, nombres, apellidos, telefono, username FROM usuarios WHERE usuario_id=?',
    [usuarioId]
  )

  return resultado
}

export default { create, where, findById }
