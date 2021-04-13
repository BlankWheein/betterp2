
function initMap() {
  let menuDisplayed = false;
  let menuBox;
  waypoints = {
    origin: localStorage.getItem("origin"),
    destination: localStorage.getItem("destination"),
    waypoint: []
  }
  const AALBORG_BOUNDS = {
    north: 57.0822,
    south: 56.9962,
    west: 9.8159,
    east: 10.0854,
  };
  localStorage.setItem("waypoints", JSON.stringify(waypoints));
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: { lat: 57.037670000000006, lng: 9.93049 },
    restriction: {
      latLngBounds: AALBORG_BOUNDS,
      strictBounds: false,
    },
  });
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({
    draggable: true,
    map,
    panel: document.getElementById("right-panel"),
  });
  directionsRenderer.addListener("directions_changed", () => {
    console.log(map);
    computeTotalDistance(directionsRenderer.getDirections());
  });
  displayRoute(
    waypoints.origin,
    waypoints.destination,
    directionsService,
    directionsRenderer
  );
  google.maps.event.addListener(map, 'click', function (event) {
    console.log("Event");
    console.log(event);
    const pos = JSON.parse(JSON.stringify(event.latLng.toJSON(), null, 2));
    let waypoints = JSON.parse(localStorage.getItem("waypoints"));
    

    if (localStorage.getItem('select') == 'w') {
    waypoints.waypoint.push({location: `${pos.lat}, ${pos.lng}`});
    console.log(waypoints);
    localStorage.setItem("waypoints", JSON.stringify(waypoints));
    }

    if (localStorage.getItem('select') == 'o') {
    console.log(waypoints);
    waypoints.origin = `${pos.lat}, ${pos.lng}`;
    localStorage.setItem("origin", waypoints.origin);
    
    localStorage.setItem("waypoints", JSON.stringify(waypoints));
    }

    if (localStorage.getItem('select') == 'd') {
      console.log(waypoints);
      waypoints.destination = `${pos.lat}, ${pos.lng}`;
      localStorage.setItem("waypoints", JSON.stringify(waypoints));
      localStorage.setItem("destination", waypoints.destination);

    }
    

    if (localStorage.getItem('select') != 'n') {
      displayRoute(
        waypoints.origin,
        waypoints.destination,
        directionsService,
        directionsRenderer
      );
    }

    
  });

  document.getElementById("add_waypoint").addEventListener("click", () => {
    localStorage.setItem("select", "w");
    console.log(localStorage.getItem("select"));
  })

  document.getElementById("add_none").addEventListener("click", () => {
    localStorage.setItem("select", "n");
    console.log(localStorage.getItem("select"));
  })

  document.getElementById("add_origin").addEventListener("click", () => {
    localStorage.setItem("select", "o");
    console.log(localStorage.getItem("select"));
  })

  document.getElementById("add_destination").addEventListener("click", () => {
    localStorage.setItem("select", "d");
    console.log(localStorage.getItem("select"));
  })

  window.addEventListener("contextmenu", function() {
    if (menuDisplayed == false) {
      var left = arguments[0].clientX;
      var top = arguments[0].clientY;
  
      menuBox = document.getElementById("menu");
      menuBox.style.left = left + "px";
      menuBox.style.top = top + "px";
      menuBox.style.display = "block";
  
      arguments[0].preventDefault();
  
      menuDisplayed = true;
    } else {
      if(menuDisplayed == true){
        menuBox.style.display = "none"; 
        menuDisplayed = false;
    }
    }
    
}, false);
window.addEventListener("click", function() {
    if(menuDisplayed == true){
        menuBox.style.display = "none"; 
    }
}, true);
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

function computeTotalDistance(result) {
  let total = 0;
  const myroute = result.routes[0];

  for (let i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1000;
  document.getElementById("total").innerHTML = total + " km";



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
  var myPosition = new google.maps.LatLng(57.05497621434606, 9.920080776449737);
  var on_bridge = false;
  //console.clear();
  result.routes[0].overview_path.forEach(element => {
    if (google.maps.geometry.poly.isLocationOnEdge(myPosition, polyline, 10e-6) && on_bridge == false) {
      console.log("YOu are on the bridge! Swim!");
      on_bridge = true;
    }
  });
}