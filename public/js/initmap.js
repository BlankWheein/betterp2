let map;
/**
* Initialises the map on the html page (This is a callback from google.maps.api)
* @return   {void + 2*overload} Returns either void or 2 overloads
*/

function initMap() {
  let origin = localStorage.getItem("origin");
  let destination = localStorage.getItem("destination");  
    waypoints = {
      origin: origin,
      destination: destination,
      waypoint: []
    }
    localStorage.setItem("waypoints", JSON.stringify(waypoints));
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      disableDefaultUI: true,
    });
  
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      draggable: false,
      map,
      panel: undefined,
    });
    
    init(directionsService, directionsRenderer)

    directionsRenderer.addListener("directions_changed", () => {
      localStorage.setItem("forceReview", false);
      console.log(directionsRenderer.getDirections())
      checkpoint(directionsRenderer.getDirections().routes[0].overview_path, objects)
      var test = {
        arr: []
      }
      directionsRenderer.getDirections().routes[0].overview_path.forEach(element => {
        test.arr.push({lat: element.lat(),
                       lng: element.lng()});
      });
      console.log(test);    
    });
    displayRoute(
      waypoints.origin,
      waypoints.destination,
      directionsService,
      directionsRenderer
    );
  
  objects = [];
  fetch("/get/paths").then(data => data.json()).then(data => {
    for (const [key, value] of Object.entries(data.paths)) {
      objects.push(createPolygon(value));
      objects[objects.length - 1].setMap(map);
    }
  })
  drawRoads(map);
  
  let uuids = JSON.parse(localStorage.getItem("uuid"));
  if (uuids !== []) {
    for (i = 0; i<uuids.length; i++) {
      console.log(uuids[i]);
      FetchRetry(`/get/approved/${uuids[i]}`, 10000, 9999, {}, uuidApproved)
    }
    
  }
  document.getElementById("submit").addEventListener("click", () => {
    if (JSON.parse(localStorage.getItem("forceReview")) == null) {
      localStorage.setItem("forceReview", false);
    }
    let path = []
    var legs = directionsRenderer.getDirections().routes[0].legs;
    for (i = 0; i < legs.length; i++) {
      var steps = legs[i].steps;
      for (j = 0; j < steps.length; j++) {
        var nextSegment = steps[j].path;
        for (k = 0; k < nextSegment.length; k++) {
          path.push(nextSegment[k]);
        }
      }
    }
    let span = JSON.parse(localStorage.getItem("Span"));
    for (const [key, value] of Object.entries(span)) {
      span[key] = parseInt(value);
    }
    let body = {
      lastpoint: false,
      route: path,
      route_raw: directionsRenderer.getDirections(),
      events: JSON.parse(localStorage.getItem("place_events")),
      truck: {
        class: JSON.parse(localStorage.getItem("BridgeClassification")),
        span: span,
        width: parseFloat(localStorage.getItem("Width")),
        height: parseFloat(localStorage.getItem("Height")),
        length: parseFloat(localStorage.getItem("Length")),
      },
      waypoints: JSON.parse(localStorage.getItem("waypoints")),
      forceReview: JSON.parse(localStorage.getItem("forceReview")),
    }
    FetchRetry("/get/routes", 1000, 5, {}, (data) => {
      console.log(data.routes.approved);
      for (let route of data.routes.approved) {
        let path = route.data.route;
        let line = createPolyline({path:path});
        console.log(path, path.length)
        body.lastpoint = resultPath = google.maps.geometry.poly.containsLocation(
          new google.maps.LatLng(path[path.length - 1 ].lat, path[path.length - 1 ].lng),
          line
        )
        if (body.lastpoint) {
          console.log("Last point was true");
          break;
        }
      }
      fetch("/checkroute", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
          },
        body: JSON.stringify(body)
      }).then(data => data.json()).then(data => {
        console.log(data);
        if (data.status == 123) {
          alert("Route was rejected! either apply for the permit again to force manual review or change the route");
          localStorage.setItem("forceReview", true);
        } else {
          let uuid = JSON.parse(localStorage.getItem("uuid"));
          uuid.push(data.uuid)
          localStorage.setItem("uuid", JSON.stringify(uuid));
          FetchRetry(`/get/approved/${data.uuid}`, 10000, 9999, {}, uuidApproved)
          localStorage.setItem("forceReview", false);
        }
        
    });
      
    })
    
});
}

/**
* When a UUID is recieved from the server this function checks what the status was
* @return   {void} Returns Void
*/
function uuidApproved(data) {
  console.log("data");
  console.log(data);
  let uuids = JSON.parse(localStorage.getItem("uuid"));
  uuids.splice(uuids.indexOf(data.uuid), 1);
  if (data.status == 200) {
  alert(`Route ${data.uuid} was approved!`);
  } else if (data.status == 123) {
    console.log("UUID does not exist")
  } else if (data.status == 201) {
  alert(`Route ${data.uuid} was rejected...${data.reason}`);

  }
  localStorage.setItem("uuid", JSON.stringify(uuids));
}