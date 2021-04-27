function initMap() {
  let menuDisplayed = false;
  let menuBox;
  waypoints = {
    origin: localStorage.getItem("origin"),
    destination: localStorage.getItem("destination"),
    waypoint: []
  }
  const AALBORG_BOUNDS = {
    north: 57.07916789999999,
    south: 56.9745056,
    west: 9.7498684,
    east: 10.0656796,
  };
  localStorage.setItem("waypoints", JSON.stringify(waypoints));
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 1,
    center: { lat: 57.0488195, lng: 9.921747 },
    restriction: {
      latLngBounds: AALBORG_BOUNDS,
      strictBounds: false,
    },
  });
  const infowindow = new google.maps.InfoWindow();
  document.getElementById("submit").addEventListener("click", () => {
    if (localStorage.getItem("submitEnabled") == "false") {return;} else {
    alert("Fuck You Markus");
    localStorage.setItem("submitEnabled", "false");
    var test = {
      arr: []
    }
    directionsRenderer.getDirections().routes[0].overview_path.forEach(element => {
      test.arr.push({lat: element.lat(),
                     lng: element.lng()});
    });
    console.log(test);
    let data2 = fetchRetry("/api/get/route", {arr: test.arr}, "12345678");
    let data = fetchRetry("/api/get/route_adress", {arr: test.arr}, "Not in Places");
    
  }
  });
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({
    draggable: true,
    map,
    panel: undefined,
  });
  directionsRenderer.addListener("directions_changed", () => {
    console.log(map);
    computeTotalDistance(directionsRenderer.getDirections());
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

window.addEventListener("click", function() {
    if(menuDisplayed == true){
        menuBox.style.display = "none"; 
    }
}, true);

document.getElementById("cake").onclick = () => {
  let body = JSON.stringify({
    start: document.getElementById("start_address").value,
    end: document.getElementById("end_address").value
  });
  fetch("/getaddress", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      },
    body: body
  }).then(data => data.json()).then(data_ => console.log(data_)).catch();

}
} 

function displayRoute(origin, destination, service, display) {
  waypoints = JSON.parse(localStorage.getItem("waypoints"));
  localStorage.setItem("origin", JSON.stringify(origin));
  localStorage.setItem("destination", JSON.stringify(destination));
  waypoints.origin = origin;
  waypoints.destination = destination;
  localStorage.setItem("waypoints", JSON.stringify(waypoints));
  console.log(waypoints);
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
      } else {
        alert("Could not display directions due to: " + status);
      }
    }
  );
}

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

function computeTotalDistance(result) {
  let total = 0;
  const myroute = result.routes[0];

  for (let i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
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
  var test = {
    arr: []
  }
  result.routes[0].overview_path.forEach(element => {
    test.arr.push({lat: element.lat(),
                   lng: element.lng()});
  });
}