import { pool } from '../config/db';
import { Student } from '../types/student';
import { QueryResult } from 'pg';

export const getStudents = async (search?: string): Promise<Student[]> => {
  let sql = 'SELECT * FROM students';
  const params: any[] = [];

  if (search) {
    sql += ' WHERE name LIKE ?';
    params.push(`%${search}%`);
  }

  sql += ' ORDER BY created_at DESC';

  const result = await pool.query(sql, params);
  return result.rows as Student[];
};

export const getStudentById = async (id: number): Promise<Student | null> => {
  const result = await pool.query(
    'SELECT * FROM students WHERE id = ?',
    [id]
  );
  return (result.rows as Student[])[0] ?? null;
};

export const createStudent = async (
  name: string,
  email: string,
  age: number
): Promise<number> => {
  const result = await pool.query(
    'INSERT INTO students (name, email, age) VALUES ($1, $2, $3) RETURNING id',
    [name, email, age]
  );
  return result.rows[0].id;
};

export const updateStudent = async (
  id: number,
  name: string,
  email: string,
  age: number
): Promise<boolean> => {
  const result = await pool.query(
    'UPDATE students SET name = $1, email = $2, age = $3 WHERE id = $4',
    [name, email, age, id]
  );
  return result.rowCount! > 0;
};

export const deleteStudent = async (id: number): Promise<boolean> => {
  const result = await pool.query(
    'DELETE FROM students WHERE id = $1',
    [id]
  );
  return result.rowCount! > 0;
};
