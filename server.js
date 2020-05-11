const express = require('express');
const cors = require("cors");
const routes = require("./routes")
// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 8080;


// Requiring our models for syncing
// var db = require('./models');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
    origin:["http://localhost:3000"]
}));
// app.use(cors({
//     origin: ["https://mgr-talent.herokuapp.com"]
// }));

app.use(routes);

app.listen(PORT, function () {
    console.log('App listening on PORT ' + PORT);
});