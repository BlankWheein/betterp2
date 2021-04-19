const express = require('express');
const app = express();
var polyline = require('@mapbox/polyline');
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
app.use(bodyParser.urlencoded({
    extended: true
}));
var request = require("request");
const API_KEY = "AIzaSyDK_srYQ6mr32YHzvXhsLLbNs_ACYBf3bM";

port = process.env.PORT || 3000


var places = {
    
}


app.listen(port, "0.0.0.0", () => console.log(`Listening at ${port}`))
app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: "5mb" }));

/* Bliver ikke brugt */
const roads = [
    {north: 57.05606711324675 ,
    south: 57.053145887754454,
    west: 9.919136276036307,
    east: 9.9207438951786,}
]

/* Bliver ikke brugt */
const kage = {
 roads: [
     {
         latlng: ["57.05646892170597, 9.921632711107629", "57.05315625292653, 9.91810365934949"],
         class: "50",
         name: "limbro"
     }, {
         latlng: ["57.05543771404789, 9.90393631735949", "57.05483820054797, 9.90630806164284", "57.05387545791453, 9.908802516003732", "57.052950617998846, 9.913576847958877", "57.05272888638353, 9.917417771313884", "57.05149475075868, 9.919799572883232", "57.050298504502095, 9.924048191935793", "57.04959532712729, 9.925416118586721", "57.04838734821002, 9.92655337520999", "57.046992579710725, 9.931590563648117", "57.04693422004477, 9.937486059076964", "57.04673287852574, 9.943891174203804", "57.04655415061863, 9.950064947737639"],
         class: "100",
         name: "strandvej"
     }, {
         latlng: ["57.05281276529587, 9.915099671115646", "57.051826629361116, 9.919090797951863"],
         class: "100",
         name: "loop"
     }, {
         latlng: [""]
     }

 ]
}

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


/* Bliver ikke brugt */
app.get("/api/get", (req, res_) => {
    res_.json({"data": kage});
})

/* Bliver ikke brugt */
app.post("/api/decode_poly", async (req, res_) => {
        const poly_str = req.body.value;
        console.log(poly_str);
        const cake = polyline.decode(`${poly_str}`);
        console.log(cake);
        for (i = 0; i < cake.length-1; i++) {
            let lat2 = cake[i+1][0];
            let long2 = cake[i+1][1];
            let lat = cake[i][0];
            let long = cake[i][1];
            let lat_n, lat_s, long_e, long_w;
            if (lat2 > lat) {
                lat_n = lat2;
                lat_s = lat;
            } else {
                lat_n = lat;
                lat_s = lat2;
            }

            if (long2 > long) {
                long_e = long2;
                long_w = long;
            } else {
                long_e = long;
                long_w = long2;
            }
            console.log(lat_n, long_e, lat_s, long_w);
            var next = false;
            const pointInRect = (x > x1 && x < x2) && (y > y1 && y < y2)
           };
        console.log("DONE");
        res_.json({cake});
});

