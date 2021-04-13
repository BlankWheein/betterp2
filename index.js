const express = require('express');
const app = express();
var polyline = require('@mapbox/polyline');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
port = process.env.PORT || 3000

app.listen(port, "0.0.0.0", () => console.log(`Listening at ${port}`))
app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: "5mb" }));

const roads = [
    {north: 57.05606711324675 ,
    south: 57.053145887754454,
    west: 9.919136276036307,
    east: 9.9207438951786,}
]

const kage = {
 roads: [
     {
         latlng: ["57.05646892170597, 9.921632711107629", "57.05315625292653, 9.91810365934949"],
         class: "50",
         name: "bro"
     }
 ]
}
app.get("/api/get", (req, res_) => {
    res_.json({"data": kage});
})

app.post("/api", (req, res) => {
    console.log(req.body);
    res.send("OK");
})

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

