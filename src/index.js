const express = require('express');
require('../config.js');
const candidateRouter = require('./routes/candidate');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(candidateRouter);
app.use(cors());

app.listen(port, () => console.log("server is up", port));
