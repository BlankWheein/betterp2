/**
* @param {String} origin A LatLng string of the start pos
* @param {String} destination A LatLng string of the end pos
* @param {directionService} service A reference to the direction Service
* @param {directionRenderer} display A reference to the direction Renderer
* @return   {void + 2*overload} Returns either void or 2 overloads
*/
function displayRoute(origin, destination, service, display) {
  waypoints = JSON.parse(localStorage.getItem("waypoints"));
  localStorage.setItem("origin", JSON.stringify(origin));
  localStorage.setItem("destination", JSON.stringify(destination));
  waypoints.origin = origin;
  waypoints.destination = destination;
  localStorage.setItem("waypoints", JSON.stringify(waypoints));
  service.route(
    { 
      origin: origin,
      destination: destination,
      waypoints: waypoints.waypoint,
      travelMode: google.maps.TravelMode.DRIVING,
      avoidTolls: true,
      optimizeWaypoints: false,
    },
    (result, status) => {
      if (status === "OK") {
        display.setDirections(result);
        console.log(result);
      } else {
        alert("Could not display directions due to: " + status);
      }
    }
  );
}

//Needs to be deleted
function fetchRetry(url, body, error) {
  fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      },
    body: JSON.stringify(body)
  }).then(data => data.json()).then(data => {
    if (`status` in data) {
      if (data.status == error) {
        return setTimeout(fetchRetry, 5000, url, body, error);
      }
      
    }
    if (url == "/api/get/route_adress") {
      localStorage.setItem("submitEnabled", "true");
    }
    console.log(data.body);
    return data;
    
  }).catch(error_ => {
    console.log(error_);
    localStorage.setItem("submitEnabled", "true");
    setTimeout(fetchRetry, 5000, url, body, error);
  })
}


function checkpoint(route, objects) {
  let events = [];
  objects.forEach(o => {
    let on_route = false;
    route.forEach(e => {
      var point = new google.maps.LatLng(e.lat(), e.lng() );
     if (google.maps.geometry.poly.containsLocation(point, o)) {
       on_route = true;
       return;
     }
    })
    if (on_route) {
      console.log(o);
      events.push(o.data);
    } else {
      console.log("NAN");
      events.push({class: null, name: null})
    }
  })
  localStorage.setItem("place_events", JSON.stringify(events));
  console.log({events: events});
}

function computeTotalDistance(result, objects) {
  var polyline = new google.maps.Polyline({
    path: [],
    strokeColor: '#FF0000',
    strokeWeight: 3
  });
  var bounds = new google.maps.LatLngBounds();
  var legs = result.routes[0].legs;
  for (i = 0; i < legs.length; i++) {
    var steps = legs[i].steps;
    for (j = 0; j < steps.length; j++) {
      var nextSegment = steps[j].path;
      for (k = 0; k < nextSegment.length; k++) {
        polyline.getPath().push(nextSegment[k]);
        bounds.extend(nextSegment[k]);
      }
    }
  }
  checkpoint(result.routes[0].overview_path, objects)
}