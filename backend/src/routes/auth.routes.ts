import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { login, register } from '../controllers/auth.controller';

const router = Router();

// Auth tradicional
router.post('/register', register);
router.post('/login', login);

// Auth con Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const user = req.user as any;

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    // Redirige a Angular con el token
    res.redirect(`http://localhost:4200/auth/callback?token=${token}`);
  }
);

export default router;
