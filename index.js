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
    body.arr.forEach((i, idx) => {
        body.arr[idx].lat = body.arr[idx].lat.toFixed(5);
        body.arr[idx].lng = body.arr[idx].lng.toFixed(5);
    })
    res.json({message: "OK"});
    body.arr.forEach((i , idx, array) => {
        if (body.arr.length - 1 == idx) {
            last = true;
            return getRoute(i.lat, i.lng, body, idx)
        }
        if (`${i.lat}, ${i.lng}` in places) {
        } else {
            getRoute(i.lat, i.lng, body, idx)
        }
        return;
    });
})

app.post("/api/get/route_adress", (req, res) => {
    inRoute = true;
    console.log("route_adress");
    let body = req.body;
    body.arr.forEach((i, idx) => {
        body.arr[idx].lat = body.arr[idx].lat.toFixed(5);
        body.arr[idx].lng = body.arr[idx].lng.toFixed(5);
    })
    body["route"] = []
    body.arr.forEach(element => {
        if (!(`${element.lat}, ${element.lng}` in places)) {
            inRoute = false;
        }
    })
    if (inRoute) {
        sendDone(res, body);
    } else {
        res.json({"status": "Not in Places"});
    }
})
function checkBody(body) {
    body["places"] = []
    console.log(body);
    class50 = ["Limfjordsbroen", "Vesterbro 106"];
    class100 = ["Limfjordstunnelen"];

    body.route.forEach(e => {
        console.log([e.adresses[0], "limfjordsbroen"]);
        appended = false;
        if (!appended) {
            for (i = 0; i < 2; i++) {
                if (e.adresses[0].search(`${class50[i]}`) != -1) {
                    body.places.push(50);
                    appended = true;
                    return;
                }}}
        
        if (!appended) {
            for (i = 0; i < 1; i++) {
                if (e.adresses[0].search(`${class100[i]}`) != -1) {
                    body.places.push(100);
                    appended = true;
                    return;
                }}}
        
        if (!appended) {
            body.places.push("NAN");
        }
        
    })
    return body;
}

function sendDone(res, body) {
    console.log(Date.now());
    body.arr.forEach(element => {
        if (`${element.lat}, ${element.lng}` in places) {
            body.route.push(places[`${element.lat}, ${element.lng}`]);
        }
    })
    body = checkBody(body);
    res.json({body: body});
}

app.post("/getaddress", (req, res) => {
    getLatLng(req.body.start, (data) => {
        getLatLng(req.body.end, (data2) => {
            res.json({status: 200, "message": "OK", "DATA": [data, data2]});
        })
    });
})

var getLatLng = rateLimit(1, 2000, function(address, callback) {
    var BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
    var url = BASE_URL + `${address}` + "&key=" + API_KEY;
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            callback(body.results[0])
        } else {
            callback(null);
        }
    })
})

var getRoute = rateLimit(1, 2000, function (lat, lng, body, idx) {
        console.log(idx, body.arr.length);
    var BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
    var url = BASE_URL + `${lat}, ${lng}` + "&key=" + API_KEY;
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

