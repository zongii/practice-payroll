const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config')
const db = require('./db/db');

const app = express();

const workersRoute = require('./routes/workers');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth')

db.initDatabase();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) => {
    res.send("HELLO");
})

app.use('/workers', workersRoute);
app.use('/user', userRoute);
app.use('/auth', authRoute);

app.listen(config.port, () => {
    console.log(`App started on port ${config.port}`);
})