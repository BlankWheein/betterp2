const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
app.use(bodyParser.urlencoded({
    extended: true
}));
var request = require("request");
const API_KEY = "AIzaSyDK_srYQ6mr32YHzvXhsLLbNs_ACYBf3bM";

port = process.env.PORT || 3000
var places = {}

app.listen(port, "0.0.0.0", () => console.log(`Listening at ${port}`))
app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: "5mb" }));


app.post("/api/get/route", (req, res) => {
    const body = req.body;
    body["route"] = []
    inc = 0;
    body.arr.forEach(element => {
        if (`${element.lat}, ${element.lng}` in places) {
            console.log(places[`${element.lat}, ${element.lng}`].adresses);
        } else {
        setTimeout(getRoute, 2000+inc, element.lat, element.lng)
        inc += 2000;
        }
        return;
    });
    res.send("OK");
})

function getRoute(lat, lng) {

    var BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
    var url = BASE_URL + `${lat}, ${lng}` + "&key=" + API_KEY;
    if (`${lat}, ${lng}` in places) {
        return places[`${lat}, ${lng}`].adresses;
    } else {
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("Added address");
            body = JSON.parse(body);
            let adress;
            try {
                adress = body.results[0].formatted_address;
                console.log(body.results[0].formatted_address);
            } catch (error) {
                return null;
            }
            console.log(adress);
            if (!(`${lat}, ${lng}` in places)) {
                places[`${lat}, ${lng}`] = {
                    adresses: []
                };
            }
                let inArr = false;
                places[`${lat}, ${lng}`].adresses.forEach(element => {
                    if (element == adress) {
                        inArr = true;
                    }
                });
                if (!inArr) {
                    places[`${lat}, ${lng}`].adresses.push(adress);
                }
            return places[`${lat}, ${lng}`].adresses;
        }
        else {
            return null;
        }
    });
}
}

