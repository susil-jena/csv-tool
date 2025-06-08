const { PrismaClient } = require('@prisma/client');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const prisma = new PrismaClient();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secretkey',
};

module.exports = new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (user) return done(null, user);
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
});
