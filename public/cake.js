function initMap() {


  google.maps.Polygon.prototype.Contains = function (point) {
    var crossings = 0,
        path = this.getPath();

    // for each edge
    for (var i = 0; i < path.getLength(); i++) {
        var a = path.getAt(i),
            j = i + 1;
        if (j >= path.getLength()) {
            j = 0;
        }
        var b = path.getAt(j);
        if (rayCrossesSegment(point, a, b)) {
            crossings++;
        }
    }

    // odd number of crossings?
    return (crossings % 2 == 1);

    function rayCrossesSegment(point, a, b) {
        var px = point.lng(),
            py = point.lat(),
            ax = a.lng(),
            ay = a.lat(),
            bx = b.lng(),
            by = b.lat();
        if (ay > by) {
            ax = b.lng();
            ay = b.lat();
            bx = a.lng();
            by = a.lat();
        }
        // alter longitude to cater for 180 degree crossings
        if (px < 0) {
            px += 360;
        }
        if (ax < 0) {
            ax += 360;
        }
        if (bx < 0) {
            bx += 360;
        }

        if (py == ay || py == by) py += 0.00000001;
        if ((py > by || py < ay) || (px > Math.max(ax, bx))) return false;
        if (px < Math.min(ax, bx)) return true;

        var red = (ax != bx) ? ((by - ay) / (bx - ax)) : Infinity;
        var blue = (ax != px) ? ((py - ay) / (px - ax)) : Infinity;
        return (blue >= red);

    }

};

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
    zoom: 15,
    //maxZoom: 15, 
    //minZoom: 15,
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
    computeTotalDistance(directionsRenderer.getDirections(), poly, tunnel);
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

polyarray = [];
const poly = new google.maps.Polygon({
  path: [{lat:57.05272529190218, lng:9.917737176668847},{lat:57.05306372385469, lng:9.91805635954162},{lat:57.05367561776083, lng:9.918718205955694},{lat:57.05426836837738, lng:9.919378057667764},{lat:57.05497387331946, lng:9.920146049659246},{lat:57.0556299277329, lng:9.920869682025995},{lat:57.056316531824514, lng:9.921638492076896},{lat:57.05706403241996, lng:9.922431227192247},{lat:57.05709466289421, lng:9.922326621040666},{lat:57.0558358074135, lng:9.920956413417903},{lat:57.05492524059234, lng:9.919964157210103},{lat:57.053941462138795, lng:9.918878477577667},{lat:57.05323843425168, lng:9.918116804227157},{lat:57.05299336429895, lng:9.917867358788772},{lat:57.05276725665803, lng:9.917639371022506},],
  geodesic: false,
  strokeColor: "#ffcc33",
  strokeOpacity: 1.0,
  strokeWeight: 2,
});
const tunnel = new google.maps.Polygon({
  path: [{lat:57.0534562160397, lng:9.964558263488325},{lat:57.05436645636499, lng:9.962648530669721},{lat:57.05558591003367, lng:9.960309644408735},{lat:57.05661862177167, lng:9.958314080901655},{lat:57.057779658859445, lng:9.956082483001264},{lat:57.05802469722276, lng:9.955567498870405},{lat:57.057913846734934, lng:9.955331464477094},{lat:57.056421038560934, lng:9.958161943770762},{lat:57.05516076960027, lng:9.960597389556284},{lat:57.05444309732675, lng:9.96194922289979},{lat:57.05426228734889, lng:9.962400229337906},{lat:57.053958189182566, lng:9.962887458218788},{lat:57.05371895888467, lng:9.963354162587379},{lat:57.05326383357485, lng:9.964121274365638},],
  geodesic: true,
  strokeColor: "#ffcc33",
  strokeOpacity: 1.0,
  strokeWeight: 2,
})
poly.setMap(map);
tunnel.setMap(map);
document.getElementById("cake").onclick = () => {
  console.log(tunnel);
  console.log(polyarray);
  let message = "[";
  polyarray.forEach(e => {
    message += `{lat:${e.lat}, lng:${e.lng}},`;
  })
  message += "]";
  console.log(message);
}
map.addListener("click", addLatLng);
function addLatLng(event) {
  const path = tunnel.getPath();
  path.push(event.latLng);
  polyarray.push({lat: event.latLng.lat(), lng: event.latLng.lng()});
}}

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
        console.log(result);
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

function computeTotalDistance(result, poly, tunnel) {
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
    var point = new google.maps.LatLng(element.lat(), element.lng() );
    console.log(google.maps.geometry.poly.containsLocation(point, poly));
  });
}