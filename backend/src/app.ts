import express from 'express';
import cors from 'cors';
import passport from 'passport';
import dotenv from 'dotenv';

// 🔴 CARGAR ENV PRIMERO
dotenv.config();

// 🔴 LUEGO cargar estrategias
import './auth/google.strategy';

import studentRoutes from './routes/student.routes';
import authRoutes from './routes/auth.routes';

const app = express();


app.get("/hola", (_req, res) => {
  res.json({
    ok: true,
    message: "Hola mundo 👋 Backend funcionando"
  });
});

app.get('/env-check', (req, res) => {
  res.json({
    DATABASE_URL: process.env.DATABASE_URL
  });
});


app.use(passport.initialize());
app.use(cors());
app.use(express.json());

app.use('/students', studentRoutes);
app.use('/auth', authRoutes);

export default app;
