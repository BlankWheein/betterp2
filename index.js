//Import all required packages
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const requirement = 1.0e-4
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

//Read paths data from JSON file
let rawdata = fs.readFileSync('./data/paths.json');
let paths = JSON.parse(rawdata);

//Read routes data from JSON file
let rawdata2 = fs.readFileSync('./data/routes.json');
var routes = JSON.parse(rawdata2);

app.use(bodyParser.urlencoded({
    extended: true
}));

//Set PORT to process.env.PORT if exists, otherwise set to 3000 and start server
port = process.env.PORT || 3000
app.listen(port, "0.0.0.0", () => console.log(`Listening at ${port}`))

//Set the folder for the client, and set the JSON size limit
app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: "10mb" }));

//Route for index
app.get("/", (req, res) => {
    res.redirect("./html/index.html")
})

//Route to get all objects in the paths dict
app.get("/get/paths", (req, res) => {
    res.json({ paths: paths, status: 200, message: "OK" });
})

//Route to add a new bridge to the objects array
app.post("/add/bridge", (req, res) => {
    let bridge = req.body.bridge;
    paths[bridge.name] = bridge;
    let data = JSON.stringify(paths, null, 1);
    fs.writeFileSync('./data/paths.json', data);
    res.json({status: 200, message:"OK"});
})

//Route to update an existing bridge
app.post("/update/bridge", (req, res) => {
    let bridge = req.body.bridge;
    let oldbridge = req.body.oldbridge;
    console.log(oldbridge)
    delete paths[oldbridge.Name];
    paths[bridge.name] = bridge;
    let data = JSON.stringify(paths, null, 1);
    fs.writeFileSync('./data/paths.json', data);
    res.json({status: 200, message:"OK"});

})

//Route to remove an existing bridge
app.post("/remove/bridge", (req, res) => {
    let name = req.body.name;
    delete paths[name];
    let data = JSON.stringify(paths, null, 1);
    fs.writeFileSync('./data/paths.json', data);
    res.json({status: 200, message:"OK"});

})


//Route to Fetch existing UUID
app.get("/get/approved/:uuid", (req, res) => {
    let sent = false;
    routes.approved.forEach(e => {
        if (e.uuid == req.params.uuid) {
            if (e.status == 200) {
                res.json({ e: e,
                    uuid: req.params.uuid,
                    status: 200 });
                sent = true;
                return;
            }}})
    if (!sent) {
        routes.rejected.forEach(e => {
            if (e.uuid == req.params.uuid) {
                if (e.status == 201) {
                    res.json({ e: e,
                        uuid: req.params.uuid,
                        status: 201,
                        reason: e.reason });
                    sent = true;
                    return;
                }}})}
    if (!sent) {
        routes.review.forEach(e => {
            if (e.uuid == req.params.uuid) {
                res.json({status:1});
                sent = true;
                return;
            }})}

    if (!sent) {
        res.json({ status: 123 })
    }
})

//Route to fetch UUID from review array
app.get("/get/review/:uuid", (req, res) => {
    let sent = false;
    routes.review.forEach(e => {
        if (e.uuid == req.params.uuid) {
            if (e.status == 200) {
                res.json({ status: 200 });
                sent = true;
                return;
            }
        }
    })
    if (!sent) {
        res.json({ status: 201 })
    }
})

//Route to approve UUID

app.get("/approve/:uuid", (req, res) => {
    let uuid = req.params.uuid;
    approve_route_uuid(uuid, res);
    let data2 = JSON.stringify(routes, null, 1);
    fs.writeFileSync('./data/routes.json', data2);
});


//Function that runs when "/approve/:uuid gets called"

function approve_route_uuid(uuid, res) {
    let approved = false;
    routes.review.forEach(element => {
        if (element.uuid == uuid) {
            element.data.route.forEach(ele => {
                let class_ = element.data.truck.class;
                let height = element.data.truck.height;
                let length = element.data.truck.length;
                let width = element.data.truck.width;
                if (routes.latlng.hasOwnProperty(`${ele.lat} ${ele.lng}`)) {
                    class_ = Math.max(routes.latlng[`${ele.lat} ${ele.lng}`].class, class_)
                    class_ = Math.min(class_, 100)
                    height = Math.max(routes.latlng[`${ele.lat} ${ele.lng}`].height, height)
                    length = Math.max(routes.latlng[`${ele.lat} ${ele.lng}`].length, length)
                    width = Math.max(routes.latlng[`${ele.lat} ${ele.lng}`].width, width)
                }
                routes.latlng[`${ele.lat} ${ele.lng}`] = { lat: ele.lat,
                    lng: ele.lng, class: class_,
                    height:height, width:width, length:length};
                })
            element.message = "Approved";
            element.status = 200;
            routes.approved.push(element);
            for (i = 0; i < routes.review.length; i++) {
                if (routes.review[i].uuid == element.uuid) {
                    routes.review.splice(i, 1);
                    approved = true;
                    break;
                }}
            return;
        }})
    if (approved) {
        res.json({ status: 200,
            message: "Application was approved", uuid: uuid, routes: routes });
    } else {
        res.json({ status: 204,
            message: "Application not approved (UUID not found)", uuid: uuid, routes: routes });
    }
}

//Route to reject a UUID

app.get("/reject/:uuid/:reason", (req, res) => {
    let uuid = req.params.uuid;
    let rejected = false;
    routes.review.forEach(element => {
        if (element.uuid == uuid) {
            element.message = "Rejected";
            element.status = 201;
            element.reason = req.params.reason;
            routes.rejected.push(element);
            for (i = 0; i < routes.review.length; i++) {
                if (routes.review[i].uuid == element.uuid) {
                    routes.review.splice(i, 1);
                    rejected = true;
                    break;

                }}
            return;
    }})
    if (rejected) {
        res.json({ status: 200,
            message: "Application rejected",
        uuid: uuid, routes: routes });
    } else {
        res.json({ status: 204,
            message: "Application not rejected (UUID not found)",
            uuid: uuid, routes: routes });
    }
    let data2 = JSON.stringify(routes, null, 1);
    fs.writeFileSync('./data/routes.json', data2);
})

//Route to remove a LatLng coordinate from the approved list
app.post("/remove/latlng", (req, res) => {
    for (i = 0; i < req.body.points.length; i++) {
        delete routes.latlng[`${req.body.points[i].lat} ${req.body.points[i].lng}`];
    }
    res.json({ body: req.body });
    let data2 = JSON.stringify(routes, null, 1);
    fs.writeFileSync('./data/routes.json', data2);
})

//Route to get all routes
app.get("/get/routes", (req, res) => {
    res.json({ routes: routes, status: 200 });
})


//Function to get the Absolute difference between a and b

function diff(a, b) { return Math.abs(a - b); };

//Function that checks if a route can be approved automatically

function check_if_route_exists(data) {
    let coords = [...data.route];
    if (data.lastpoint) {
        coords.splice(coords.length - 1, 1);
    }
    let exit = false;
    for (i = 0; i < coords.length; i++) {
        exit = false;
        for (const [key, value] of Object.entries(routes.latlng)) {
            if (diff(value.lat, coords[i].lat) <= requirement) {
                    if (diff(value.lng, coords[i].lng) <= requirement) {
                        if (value.class >= data.truck.class &&
                            value.length >= data.truck.length &&
                            value.height >= data.truck.height &&
                            value.width >= data.truck.width) {
                            coords.splice(i, 1);
                            i--;
                            exit = true;
                            break;
                        }
                    }
            }
            if (exit) { break; }
        }
    }
    if (coords.length == 0) {
        return true;
    }
    return false;
}

//Function that gets the right span value from the truck

function getSpan(data, span) {
 let truck = data.truck.span;
 if (span <= 2) { return truck.span2;}
 if (span <= 4) {return truck.span4;}
 if (span <= 6) {return truck.span6;}
 if (span <= 8) {return truck.span8;}
 if (span <= 10) {return truck.span10;}
 if (span <= 15) {return truck.span15;}
 if (span <= 20) {return truck.span20;}
 if (span <= 25) {return truck.span25;}
 if (span <= 30) {return truck.span30;}
 if (span <= 40) {return truck.span40;}
 if (span <= 50)  {return truck.span50;}
 if (span <= 60) {return truck.span60;}
 if (span <= 80) {return truck.span80;}
 if (span <= 100) {return truck.span100;}
 if (span <= 200) {return truck.span200;}
 return "Unspecified";
}

//Function to check route against all objects
function checkroute(data) {
    let message = "Waiting for approval";
    let status = 201;
    //data = parse_data(data);
    if (!data.forceReview) {
        if (check_if_route_exists(data)) {
            status = 200;
            message = "APPROVED";
        }
        console.log("Cheking route");
        data.events.forEach(e => {
            let span = getSpan(data, e.spand);
            console.log({data:data, e:e, span:span})
            if (span > e.class && e.class != null) {
                status = 123;
                message = "Span exeeced"
                return
            }
        });
    }
    
    return [status, message, data];
}

//Route that calls all functions to check if route can be approved automatically
app.post("/checkroute", (req, res) => {
    let body = req.body;
    let secondsSinceEpoch = Math.round(Date.now() / 1000)
    let uuid = `${uuidv4()}-${secondsSinceEpoch}`;
    let data = checkroute(body);
    data.uuid = uuid;
    if (data[0] === 201) {
        routes.review.push({ status: data[0], message: data[1], data: data[2], uuid: uuid });
        res.json({ status: data[0], message: data[1], data: data[2], uuid: uuid })

    } else if (data[0] === 200) {
        routes.review.push({ status: data[0], message: data[1], data: data[2], uuid: uuid });
        approve_route_uuid(uuid, res);
    } else {
        res.json({ status: data[0], message: data[1], data: data[2], uuid: uuid, error: 203 })
    }

    let data2 = JSON.stringify(routes, null, 1);
    fs.writeFileSync('./data/routes.json', data2);

})

