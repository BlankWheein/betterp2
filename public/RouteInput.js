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
    maxZoom: 1, 
    minZoom: 1,
    restriction: {
      latLngBounds: AALBORG_BOUNDS,
      strictBounds: false,
    },
  });
  const input = document.getElementById("pac-input");
  const options = {
    fields: ["address_component", "geometry"],
    componentRestrictions: { country: "dk" },
    strictBounds: false,
  };
  const autocomplete = new google.maps.places.Autocomplete(input, options);
  autocomplete.setFields(["geometry", "address_components"]);
  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById("infowindow-content");
  infowindow.setContent(infowindowContent);
  autocomplete.addListener("place_changed", () => {
    infowindow.close();
    const place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    let address = "";

    if (place.address_components) {
      address = [
        (place.address_components[0] &&
          place.address_components[0].short_name) ||
          "",
        (place.address_components[1] &&
          place.address_components[1].short_name) ||
          "",
        (place.address_components[2] &&
          place.address_components[2].short_name) ||
          "",
      ].join(" ");
    }
    infowindowContent.children["place-icon"].src = place.icon;
    infowindowContent.children["place-name"].textContent = place.name;
    infowindowContent.children["place-address"].textContent = address;
    localStorage.setItem("start_address", JSON.stringify(`${place.geometry.location.lat()}, ${place.geometry.location.lng()}`));
    displayRoute(
      `${place.geometry.location.lat()}, ${place.geometry.location.lng()}`,
      waypoints.destination,
      directionsService,
      directionsRenderer
    );

  });






  const input2 = document.getElementById("pac-input2");
  const autocomplete2 = new google.maps.places.Autocomplete(input2, options);
  autocomplete2.setFields(["geometry", "address_components"]);
  const infowindow2 = new google.maps.InfoWindow();
  const infowindowContent2 = document.getElementById("infowindow-content2");
  infowindow2.setContent(infowindowContent);
  autocomplete2.addListener("place_changed", () => {
    infowindow2.close();
    const place2 = autocomplete2.getPlace();

    if (!place2.geometry || !place2.geometry.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place2.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    let address = "";

    if (place2.address_components) {
      address = [
        (place2.address_components[0] &&
          place2.address_components[0].short_name) ||
          "",
        (place2.address_components[1] &&
          place2.address_components[1].short_name) ||
          "",
        (place2.address_components[2] &&
          place2.address_components[2].short_name) ||
          "",
      ].join(" ");
    }

    infowindowContent2.children["place-icon2"].src = place2.icon;
    infowindowContent2.children["place-name2"].textContent = place2.name;
    infowindowContent2.children["place-address2"].textContent = address;
    localStorage.setItem("end_address", JSON.stringify(`${place2.geometry.location.lat()}, ${place2.geometry.location.lng()}`));
    displayRoute(
      waypoints.origin,
      `${place2.geometry.location.lat()}, ${place2.geometry.location.lng()}`,
      directionsService,
      directionsRenderer
    );
  });
  const input3 = document.getElementById("pac-input3");
  const autocomplete3 = new google.maps.places.Autocomplete(input3, options);
  autocomplete3.setFields(["geometry", "address_components"]);
  const infowindow3 = new google.maps.InfoWindow();
  const infowindowContent3 = document.getElementById("infowindow-content3");
  infowindow3.setContent(infowindowContent);
  autocomplete3.addListener("place_changed", () => {
    infowindow3.close();
    const place3 = autocomplete3.getPlace();

    if (!place3.geometry || !place3.geometry.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place3.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    let address = "";

    if (place3.address_components) {
      address = [
        (place3.address_components[0] &&
          place3.address_components[0].short_name) ||
          "",
        (place3.address_components[1] &&
          place3.address_components[1].short_name) ||
          "",
        (place3.address_components[2] &&
          place3.address_components[2].short_name) ||
          "",
      ].join(" ");
    }

    infowindowContent3.children["place-icon3"].src = place3.icon;
    infowindowContent3.children["place-name3"].textContent = place3;
    infowindowContent3.children["place-address3"].textContent = address;
    document.getElementById("pac-input3").value = "";
    let middles = JSON.parse(localStorage.getItem("middle_address"));
    if (middles == null || middles == undefined) {
      middles = [];
    }
    address2 = `${place3.geometry.location.lat()}, ${place3.geometry.location.lng()}`;
    let in_element = false;
    middles.forEach(element => {
      if (element == address2) {
        in_element = true;
      }
    })
    if (!in_element) {
      middles.push({location: address2});
      waypoints = JSON.parse(localStorage.getItem("waypoints"));
      waypoints.waypoint = middles;
      localStorage.setItem("middle_address", JSON.stringify(middles));
      var node = document.createElement(`array${middles.length}`);
      node.id = `array${address2.replace(",", "")}`;
      var textnode = document.createTextNode(`${address} `);
      var button = document.createElement(`button`);
      button.id = `button${address2.replace(",", "")}`;
      localStorage.setItem("waypoints", JSON.stringify(waypoints));
      button.textContent = "Remove";
      var br = document.createElement("br");
      node.appendChild(textnode);
      node.appendChild(button);
      node.appendChild(br); 
      document.getElementById("listofw").appendChild(node);
    }
    
    displayRoute(
      waypoints.origin,
      waypoints.destination,
      directionsService,
      directionsRenderer
    );
    button = document.getElementById(`button${address2.replace(",", "")}`);
    button.onclick = () => {
      var node = document.getElementById(button.id.replace("button", "array"));
      address2 = button.id.replace("button", "");
      console.log(address2);
      waypoints = JSON.parse(localStorage.getItem("waypoints"));
      middles = JSON.parse(localStorage.getItem("middle_address"));
      node.remove();
      for (var i = 0; i < waypoints.waypoint.length; i++) {
        if (waypoints.waypoint[i].location.replace(",","") == address2) {
          waypoints.waypoint.splice(i, 1);
          break;
        }

      }
      for (var i = 0; i < middles.length; i++) {
        if (middles[i].location.replace(",","") == address2) {
          middles.splice(i, 1);
          break;
        }

      }
      localStorage.setItem("middle_address", JSON.stringify(middles));
      localStorage.setItem("waypoints", JSON.stringify(waypoints));
      displayRoute(waypoints.origin, waypoints.destination, directionsService, directionsRenderer);
      }
  });




  function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}


  


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
    draggable: false,
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
    start: localStorage.getItem("start_address"),
    end: localStorage.getItem("end_address")
  });
  fetch("/getaddress", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      },
    body: body
  }).then(data => data.json()).then(data => {
    let origin = `${data.DATA[0].geometry.location.lat}, ${data.DATA[0].geometry.location.lng}`;
    let destination = `${data.DATA[1].geometry.location.lat}, ${data.DATA[1].geometry.location.lng}`; 

    waypoints = JSON.parse(localStorage.getItem("waypoints"));
    waypoints.origin = origin;
    waypoints.destination = destination;
    localStorage.setItem("waypoints", JSON.stringify(waypoints));
    displayRoute(
      waypoints.origin,
      waypoints.destination,
      directionsService,
      directionsRenderer
    );
  }).catch();

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