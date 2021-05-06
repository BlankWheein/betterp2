
function initMap() {
    let menuDisplayed = false;
    let menuBox;
    waypoints = {
      origin: localStorage.getItem("origin"),
      destination: localStorage.getItem("destination"),
      waypoint: []
    }
    localStorage.setItem("waypoints", JSON.stringify(waypoints));
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      disableDefaultUI: true,
    });
    
  
    document.getElementById("submit").addEventListener("click", () => {
      let body = {
        route: directionsRenderer.getDirections().routes[0].overview_path,
        route_raw: directionsRenderer.getDirections(),
        events: JSON.parse(localStorage.getItem("place_events")),
        truck: {
          class: JSON.parse(localStorage.getItem("BridgeClassification"))
        },
        uuid: localStorage.getItem("uuid")
      }
      fetch("/checkroute", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
          },
        body: JSON.stringify(body)
      }).then(data => data.json()).then(data => {
        console.log(data);
    });
  });
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      draggable: false,
      map,
      panel: undefined,
    });
    init(directionsService, directionsRenderer)

    directionsRenderer.addListener("directions_changed", () => {
      computeTotalDistance(directionsRenderer.getDirections(), objects);
      var test = {
        arr: []
      }
      directionsRenderer.getDirections().routes[0].overview_path.forEach(element => {
        test.arr.push({lat: element.lat(),
                       lng: element.lng()});
      });      
    });
    displayRoute(
      waypoints.origin,
      waypoints.destination,
      directionsService,
      directionsRenderer
    );
  
  objects = [];
  let create = createPolyline("create", [], 0);
  create.setMap(map);

  create.createpath = [];
  
  fetch("/get/paths").then(data => data.json()).then(data => {
    for (const [key, value] of Object.entries(data.paths)) {
      objects.push(createPolygon(value));
      objects[objects.length - 1].setMap(map);
    }
  })

  if (localStorage.getItem("uuid") === null) {
    fetch("/get/uuid").then(data => data.json()).then(data => {
      localStorage.setItem("uuid", data.data);
    });
  } else {
    console.log(localStorage.getItem("uuid"))
  }

  FetchRetry(`/get/approved/${localStorage.getItem("uuid")}`, 5000, 9999, {})
  .then(data => {
    console.log("data");
    console.log(data);
  })

  

  console.log(objects);
  
  document.getElementById("cake").onclick = () => {
    let message = "[";
    create.createpath.forEach(e => {
      message += `{lat:${e.lat}, lng:${e.lng}},`;
    })
    message += "];";
    console.log(message);
  }
  map.addListener("click", addLatLng);
  function addLatLng(event) {
    const path = create.getPath();
    path.push(event.latLng);
    create.createpath.push({lat: event.latLng.lat(), lng: event.latLng.lng()});
  }}

  function createPolygon(data) {

    if (data.name === undefined) {data.name = "Not Specified";}
    if (data.path === undefined) {data.path = [];}
    if (data.class === undefined) {data.class = 0;}
    if (data.type === undefined) {data.type = "Not defined";}
    if (data.color === undefined) {data.color = "#ffcc33";}
    if (data.geodesic === undefined) {data.geodesic = false;}
    if (data.strokeWeight === undefined) {data.strokeWeight = 2;}
    if (data.strokeOpacity === undefined) {data.strokeOpacity = 1.0;}
    if (data.spand === undefined) {data.spand = null;}

    let polygon = new google.maps.Polygon({
        path: data.path,
        geodesic: data.geodesic,
        strokeColor: data.color,
        strokeOpacity: data.strokeOpacity,
        strokeWeight: data.strokeWeight,
        data: {
            Name: data.name,
            class: data.class,
            type: data.type,
            spand: data.spand,
            raw: data,
        }
      })
      return polygon;
  }

  function createPolyline(name, path, class_, type=undefined, color="#ffcc33", geodesic=false, strokeWeight=2, strokeOpacity=1.0) {
    let polygon = new google.maps.Polyline({
        path: path,
        geodesic: geodesic,
        strokeColor: color,
        strokeOpacity:strokeOpacity,
        strokeWeight: strokeWeight,
        data: {
            Name: name,
            class: class_,
            type: type,
        }
      })
      return polygon;
  }


function wait(delay){
    return new Promise((resolve) => setTimeout(resolve, delay));
}

function FetchRetry(url, delay, tries, fetchOptions = {}) {
    function onError(err){
        triesLeft = tries - 1;
        console.log(`trying again ${triesLeft}`)
        if(!triesLeft){
            throw err;
        }
        return wait(delay).then(() => FetchRetry(url, delay, triesLeft, fetchOptions));
    }
    return fetch(url,fetchOptions).then(data => data.json()).then(data => {
      if (data.status == 1) {
        console.log(data);
        throw new Error("Status was not Approved");
      }
    }).catch(onError);
}