const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
var rateLimit = require('function-rate-limit');
const requirement = 1.0e-5
const fs = require('fs');
app.use(bodyParser.urlencoded({
    extended: true
}));
var routes = {
    review: [],
    approved: [],
};
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


app.get("/approve_routes", (req, res) => {
    for (i = 0; i < routes.review.length; i++) {
        routes.approved.push(routes.review.pop());
    }
    res.json({status:200, message:"OK", routes:routes});
})

app.get("/print_routes", (req, res) => {
    res.json({routes: routes});
})
function diff(a, b) { return Math.abs(a - b); };
function check_if_route_exists(data) {
    let coords = [...data.route];
    let min_class = Infinity;
    routes.approved.forEach(route => {
        route.data.route.forEach(coord => {
            for (i = 0; i < coords.length; i++) {
                if (diff(coords[i].lat, coord.lat <= requirement) && diff(coords[i].lng, coord.lng <= requirement)) {
                    coords.pop(i);
                    min_class = Math.min(route.data.truck.class, min_class);
                    break;
                }
            }
            if (coords.length == 0) {
                return;
            }
        })
        if (coords.length == 0) {
            return;
        }
    })
    if (coords.length == 0 && min_class <= data.truck.class) {
        return true;
    } else {
        return false;
    }
}
function checkroute(data) {
    let message = "OK";
    let status = 200;
    data = parse_data(data);
    if (check_if_route_exists(data)) {
        console.log("Route already exists")
    } else {
        console.log("Cheking route");
        data.events.forEach(e => {
            if (e.class < data.truck.class && e.class != null) {
                status = 203;
                message = "Class Exeeced"
                return
            }
        });
    }
    
    return [status, message, data];
}



function parse_data(data) {
    data.route.forEach(e => {
        e.lat = parseFloat(e.lat.toFixed(5));
        e.lng = parseFloat(e.lng.toFixed(5));
    })
    return data;
}



app.post("/checkroute", (req, res) => {
    let body = req.body;
    let data = checkroute(body);
    console.log(data);
    if (data[0] === 200) {
        routes.review.push({status: data[0], message:data[1], data:data[2]});
    }
    res.json({status: data[0], message: data[1], data:data[2]})
})

