const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./router/router');

const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(routes)

app.listen(4000, () => {
    console.log("Server running at port 4000")
})