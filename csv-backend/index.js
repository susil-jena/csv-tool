const express = require('express');
const cors = require('cors');
const passport = require('./auth/passport');
const authRoutes = require('./routes/authRoutes');
const csvRoutes = require('./routes/csvRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form-data / x-www-form-urlencoded
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/csv', csvRoutes);

app.get('/', (req, res) => {
  res.send('CSV Manager API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
