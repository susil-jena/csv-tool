const passport = require('passport');
const JwtStrategy = require('./jwtStrategy');

passport.use(JwtStrategy);

module.exports = passport;
