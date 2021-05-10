let map;
let directionsRenderer;
let directionsService;
let clicked = false;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 57.039147404431446, lng: 9.92974536576044 },
    zoom: 12,
    disableDefaultUI: true,
  });

FetchRetry("/get/routes", 2500, 10, {}, (data) => {
  let heatmapData = [];
  for (const [key, value] of Object.entries(data.routes.latlng)) {
    let point = new google.maps.LatLng(value.lat, value.lng );
    heatmapData.push(point);  
  }
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
    gradient: ["rgba(0, 0, 0, 0)", "red", "red"],
    maxIntensity: 0,
    map:map,
  });
  
})
drawRoads(map);
}