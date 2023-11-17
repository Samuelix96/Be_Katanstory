/** @format */

const mongoose = require('mongoose');
const express = require('express');
const PORT = 5050;
const cors = require('cors');
require('dotenv').config();

const armorsRoute = require('./Routes/armors');
const helmetsRoute = require('./Routes/helmets');
const usersRoute = require('./Routes/users');
const standsRoute = require('./Routes/stands');
const katanasRoute = require('./Routes/katanas');
const loginRoute = require('./Routes/login');
const postsRoute = require('./Routes/posts');
const registrationRoute = require('./Routes/registration');
const forgetRoute = require('./Routes/forget');
const resetRoute = require('./Routes/reset');
const stripeRoute = require('./Routes/stripe');
const cron = require('node-cron');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/', armorsRoute);
app.use('/', helmetsRoute);
app.use('/', usersRoute);
app.use('/', standsRoute);
app.use('/', loginRoute);
app.use('/', postsRoute);
app.use('/', katanasRoute);
app.use('/', registrationRoute);
app.use('/', forgetRoute);
app.use('/', resetRoute);
app.use('/', stripeRoute);

cron.schedule('*/30 * * * *', async () => {
  try {
    const response = await axios.get(`${process.env.CLIENT_URL}/posts`);
    console.log('Richiesta eseguita con successo:', response.data);
  } catch (error) {
    console.error('Errore durante la richiesta:', error.message);
  }
});

mongoose.connect(`${process.env.MONGODB_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error during db connection'));
db.once('open', () => console.log('Database successfully connected'));
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
