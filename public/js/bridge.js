let map;

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
  //Create the object for drawing new bridges
  let area = createPolyline({name:"area", path:[], color:"#FF69B4"});
  area.createpath = [];
  area.setMap(map);

  objects = [];
  
  //Get all objects and draw them on the map
  fetch("/get/paths").then(data => data.json()).then(data => {
    for (const [key, value] of Object.entries(data.paths)) {
      objects.push(createPolygon(value));
      objects[objects.length - 1].setMap(map);
    }
  })

  //Adds a listener when clicked to draw the bridge
  map.addListener("click", addLatLng);
  function addLatLng(event) {
    const path = area.getPath();
    path.push(event.latLng);
    area.createpath.push({lat: event.latLng.lat(), lng: event.latLng.lng()});
  }
  //Adds a listener when clicked on the clear button
  document.getElementById("clear").onclick = () => {
    let path = area.getPath();
    area.createpath = [];
    path.clear();
  }

  //Adds a listener when clicked on the add_bridge button
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
    //Calls the "/add/bridge" route to add a bridge to the server
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