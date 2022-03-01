const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { user: rol } = require("../lib/roles");
const { getConnection, querysAuth } = require("../database/index");
const bcrypt = require("bcrypt");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `/auth/google/callback`,
    },
    async (accessToken, refreshToken, user, done) => {
      try {
        const pool = await getConnection();

        // console.log(user.emails[0].value);
        const existUser = await pool.query(
          `SELECT * FROM users WHERE email LIKE '${user.emails[0].value}'`
        );

        if (existUser[0].length !== 0) {
          return done(null, user);
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user.emails[0].value, salt);

        await pool.query(querysAuth.createUserWithGoogle, [
          user.emails[0].value,
          user.emails[0].value,
          hashPassword,
          rol,
          user.emails[0].verified,
        ]);

        return done(null, user);
      } catch (e) {
        console.log(e);
        return done(e, null);
      }
    }
  )
);

// convierte el usuario de obj a string
passport.serializeUser((user, done) => {
  done(null, user);
});

// convierte el usuario de string a un obj
passport.deserializeUser((user, done) => {
  done(null, user);
});
