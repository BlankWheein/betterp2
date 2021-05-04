const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
var rateLimit = require('function-rate-limit');
const fs = require('fs');
app.use(bodyParser.urlencoded({
    extended: true
}));
var routes = [];
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

function my_func(data) {
    let message = "OK";
    let status = 200;
    data.events.forEach(e => {
        if (e.class < data.truck.class) {
            status = 203;
            message = "Class Exeeced"
            return
        }
    });

    return [status, message, data];
}

app.post("/checkroute", (req, res) => {
    let body = req.body;
    let data = my_func(body);
    console.log(data);
    if (data[0] === 200) {
        routes.push({status: data[0], message:data[1], data});
    }
    res.json({status: data[0], message: data[1], data:data[2]})
})

