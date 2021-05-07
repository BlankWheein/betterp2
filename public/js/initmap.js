
function initMap() {
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
        waypoints: JSON.parse(localStorage.getItem("waypoints"))
      }
      fetch("/checkroute", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
          },
        body: JSON.stringify(body)
      }).then(data => data.json()).then(data => {
        console.log(data);
        let uuid = JSON.parse(localStorage.getItem("uuid"));
        uuid.push(data.uuid)
        localStorage.setItem("uuid", JSON.stringify(uuid));
        FetchRetry(`/get/approved/${data.uuid}`, 10000, 9999, {}, uuidApproved)
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
  let create = createPolyline({name:"create", path:[]});
  create.setMap(map);

  create.createpath = [];
  
  fetch("/get/paths").then(data => data.json()).then(data => {
    for (const [key, value] of Object.entries(data.paths)) {
      objects.push(createPolygon(value));
      objects[objects.length - 1].setMap(map);
    }
  })

  
  let uuids = JSON.parse(localStorage.getItem("uuid"));
  if (uuids !== []) {
    for (i = 0; i<uuids.length; i++) {
      console.log(uuids[i]);
      FetchRetry(`/get/approved/${uuids[i]}`, 10000, 9999, {}, uuidApproved)
    }
    
  }
    
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

  function uuidApproved(data) {
    console.log("data");
    console.log(data);
    let uuids = JSON.parse(localStorage.getItem("uuid"));
    uuids.splice(uuids.indexOf(data.uuid), 1);
    if (data.status == 200) {
    alert(`Route ${data.uuid} was approved!`);
    } else {
    alert(`Route ${data.uuid} was rejected...${data.reason}`);

    }
    localStorage.setItem("uuid", JSON.stringify(uuids));
  }

  




