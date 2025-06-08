const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();
const passport = require('../auth/passport');

router.post('/register', register);
router.post('/login', login);
router.get('/protected',passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ message: 'Hello, authenticated user!', user: req.user });
});

module.exports = router;
