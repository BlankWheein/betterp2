let map;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 57.039147404431446, lng: 9.92974536576044 },
    zoom: 12,
    disableDefaultUI: true,
  });
  let area = createPolyline({name:"area", path:[], color:"#FF69B4"});
  area.createpath = [];
  area.setMap(map);

  objects = [];
  
  fetch("/get/paths").then(data => data.json()).then(data => {
    for (const [key, value] of Object.entries(data.paths)) {
      objects.push(createPolygon(value));
      objects[objects.length - 1].setMap(map);
    }
  })

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

  document.getElementById("add_bridge").onclick = () => {
    let class_ = parseFloat(document.getElementById("class").value);
    let spand = parseFloat(document.getElementById("spand").value);
    let name = document.getElementById("name").value;
    if (name == "" || class_ == NaN || spand == NaN) {
      return alert("Please specify bridge data");
    }
    let body = {
      bridge: {
        class: class_,
        spand: spand,
        name: name,
        path: area.createpath,
      }
    }
    FetchRetry("/add/bridge", 1000, 10,  {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
        },
      body: JSON.stringify(body)
    }, (data) => {
      console.log(data)
      location.reload();

    })
  }

}