import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { pool } from '../config/db';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/auth/google/callback'
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0].value;
        const name = profile.displayName;

        const result = await pool.query(
          'SELECT * FROM users WHERE google_id = $1',
          [googleId]
        );

        if (result.rows.length) return done(null, result.rows[0]);

        const result2 = await pool.query(
          'INSERT INTO users (email, name, provider, google_id) VALUES ($1, $2, $3, $4) RETURNING id',
          [email, name, 'google', googleId]
        );

        done(null, { id: result2.rows[0].id, email });
      } catch (err) {
        done(err);
      }
    }
  )
);