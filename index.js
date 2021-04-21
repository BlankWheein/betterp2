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


app.post("/api/get/route", (req, res) => {
    let body = req.body;
    body["route"] = []
    console.log(Date.now());
    inc = 0;
    let last = false;
    body.arr.forEach((i, idx) => {
        body.arr[idx].lat = body.arr[idx].lat.toFixed(5);
        body.arr[idx].lng = body.arr[idx].lng.toFixed(5);
    })
    body.arr.forEach((i , idx, array) => {
        if (body.arr.length - 1 == idx) {
            last = true;
            return getRoute(i.lat, i.lng, last, res, body, idx)
        }
        if (`${i.lat}, ${i.lng}` in places) {
        } else {
            getRoute(i.lat, i.lng, last, res, body, idx)
        }
        return;
    });
})

function sendDone(res, body) {
    console.log(Date.now());
    
    body.arr.forEach(element => {
        if (`${element.lat}, ${element.lng}` in places) {
            body.route.push(places[`${element.lat}, ${element.lng}`]);
        }
    })
    res.json({body: body});
}


var getRoute = rateLimit(1, 2000, function (lat, lng, last, res, body, idx) {
    console.log(idx, body.arr.length);
    var BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
    var url = BASE_URL + `${lat}, ${lng}` + "&key=" + API_KEY;
    if (last) {
        setTimeout(sendDone, 2000, res, body);
    }
    if (`${lat}, ${lng}` in places) {
        return places[`${lat}, ${lng}`].adresses;
    } else {
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            let adress;
            try {
                adress = body.results[0].formatted_address;
            } catch (error) {
                return null;
            }
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
                    fs.writeFileSync("data.txt", JSON.stringify(places));
                }
            return places[`${lat}, ${lng}`].adresses;
        }
        else {
            return null;
        }
    });
}
});

