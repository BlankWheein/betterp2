let map;
let directionsRenderer;
let directionsService;
let clicked = false;

/**
* Initialises the map on the html page (This is a callback from google.maps.api)
* @return   {void + 2*overload} Returns either void or 2 overloads
*/
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 57.039147404431446, lng: 9.92974536576044 },
    zoom: 12,
    disableDefaultUI: true,
  });
  let area = createPolyline({name:"area", path:[], color:"#FF69B4"});
  area.createpath = [];
  area.setMap(map);

  map.addListener("click", addLatLng);
  function addLatLng(event) {
    const path = area.getPath();
    path.push(event.latLng);
    area.createpath.push({lat: event.latLng.lat(), lng: event.latLng.lng()});
  }
  document.getElementById("clear").onclick = () => {
    let path = area.getPath();
    area.createpath = [];
    path.clear();
  }

  document.getElementById("reject").onclick = () => {
    let points = [];
    FetchRetry("/get/routes", 5000, 10, {}, (data) => {
      console.log(data);
      for (const [key, value] of Object.entries(data.routes.latlng)) {
      var point = new google.maps.LatLng(value.lat, value.lng );
      let resultPath = google.maps.geometry.poly.containsLocation(point,area)
      if (resultPath) {
        points.push({lat:value.lat, lng:value.lng});
      }
    }
    FetchRetry("/remove/latlng", 5000, 10, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({points: points})
    }, (data) => {
      console.log(data);
      location.reload();
    });

  })
}
FetchRetry("/get/routes", 2500, 10, {}, (data) => {
  let heatmapData = [];
  for (const [key, value] of Object.entries(data.routes.latlng)) {
    let point = new google.maps.LatLng(value.lat, value.lng );
    heatmapData.push(point);  
  }
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
  });
  
})
drawRoads(map);
}