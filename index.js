const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
var rateLimit = require('function-rate-limit');
const fs = require('fs');
app.use(bodyParser.urlencoded({
    extended: true
}));
var request = require("request");
const API_KEY = "AIzaSyDK_srYQ6mr32YHzvXhsLLbNs_ACYBf3bM";

port = process.env.PORT || 3000
const places = JSON.parse(fs.readFileSync('./data.txt',
            {encoding:'utf8', flag:'r'}));

app.listen(port, "0.0.0.0", () => console.log(`Listening at ${port}`))
app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: "5mb" }));

app.get("/", (req, res) => {
    res.redirect("./html/index.html")
})

