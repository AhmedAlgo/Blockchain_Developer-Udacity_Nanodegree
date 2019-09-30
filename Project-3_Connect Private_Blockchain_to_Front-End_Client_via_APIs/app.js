const express = require('express');
const bodyParser = require('body-parser');

const port = 8000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./mempool')(app);

app.listen(port, () => console.log(`running on ${port}`));
