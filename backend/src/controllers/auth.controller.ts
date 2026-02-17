import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';
import { Request, Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET!;

export const register = async (req:Request, res: Response) => {
  const { email, password, name } = req.body;

  console.log(req.body);

  const hash = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name, provider) VALUES ($1, $2, $3, $4) RETURNING id',
      [email, hash, name, 'local']
    );

    const token = jwt.sign({ id: result.rows[0].id, email }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token });
  } catch (e: any) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already registered' });
    }
    res.status(500).json({ message: 'Register error'+e.message });
  }
};


export const login = async (req:Request, res: Response) => {
  const { email, password } = req.body;

  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1 AND provider = $2',
    [email, 'local']
  );

  const user = result.rows[0];
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email, color:'rojo' }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
};
