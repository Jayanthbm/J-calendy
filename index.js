const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./src/router/router');

const app = express();
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.use(cors())
app.use(bodyParser.json())
app.use(routes)
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/frontend/build/index.html'));
});
const port = process.env.PORT || 5000;
app.listen(port);