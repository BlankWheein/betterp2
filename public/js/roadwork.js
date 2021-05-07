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
  directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
      draggable: false,
      map,
      panel: undefined,
    });
  let area = createPolyline("area", [], 0);
  area.setMap(map);

  map.addListener("click", addLatLng);
  function addLatLng(event) {
    const path = area.getPath();
    path.push(event.latLng);
    area.createpath.push({lat: event.latLng.lat(), lng: event.latLng.lng()});
  }
}

function remove_area_from_backlog() {
    console.log("clicked")
    if (clicked) {return;}
    clicked = true;
    FetchRetry("/get/routes", 2500, 10, {}, (data) => {
        console.log(data);
        
    })
}