const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./src/router/router');

var port = process.env.PORT || 4000;
const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(routes)

app.listen(port, () => {
    console.log(`Server running at port ${port}`)
})