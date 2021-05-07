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

  document.getElementById("print").onclick = () => {
    console.log(area);
  }

  document.getElementById("reject").onclick = () => {
    FetchRetry("/get/routes", 5000, 10, {}, (data) => {
      console.log(data);
      for (const [key, value] of Object.entries(data.routes.lat)) {
      var point = new google.maps.LatLng(value.lat, value.lng );
      let resultPath = google.maps.geometry.poly.containsLocation(point,area)
      if (resultPath) {
        console.log({key:key,value:value,point:point,result:resultPath});
      }

    }
  })
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