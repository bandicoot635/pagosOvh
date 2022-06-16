const cors = require('cors');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use(require('./routes/pagosOvh'));
app.use(require('./routes/generarOvh'));

app.listen(port);
console.log('Server on port ' + port);