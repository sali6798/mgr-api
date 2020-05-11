const express = require('express');
const cors = require("cors");
const logger = require("morgan");
const mongoose = require("mongoose");
const routes = require("./routes");
// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 8080;

app.use(logger("dev"));

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

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/mgr");

app.listen(PORT, function () {
    console.log('App listening on PORT ' + PORT);
});