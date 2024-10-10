const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const User = require('./models/User');
const userRoutes = require('./routes/users');

const app = express();


app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

mongoose.connect('mongodb://localhost/user-management', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/users', userRoutes);
app.get('/', (req, res) => {
  res.redirect('/users/login');
});
app.get('/', (req, res) => {
  res.redirect('/views/login');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
