const express = require('express');
const moment = require('moment');
const _ = require('loadsh');
const app = express();
const port = 9000;
app.get('/', (req, res) => {
    console.log("request at ", moment());
    res.send('Hello World!')
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
