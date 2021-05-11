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


  objects = [];
  //Get all objects and draw them on the map
  fetch("/get/paths").then(data => data.json()).then(data => {
    for (const [key, value] of Object.entries(data.paths)) {
      objects.push(createPolyline(value));
      objects[objects.length - 1].setMap(map);
    }
  })

  //Adds a listener when clicked on the map
  google.maps.event.addListener(map, "click", (e) => {
    for (let bridge of objects) {
      if(google.maps.geometry.poly.containsLocation(e.latLng, bridge)) {
        console.log(bridge);
        let data = bridge.data;
        localStorage.setItem("oldbridge", JSON.stringify(data));
        document.getElementById("name").value = data.Name;
        document.getElementById("class").value = data.class;
        document.getElementById("spand").value = data.spand;
      }
    }
  })


  document.getElementById("remove_bridge").onclick = () => {
    let name = document.getElementById("name").value;
    let body = {
      name:name,
    }
    FetchRetry("/remove/bridge", 1000, 10,  {
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

  document.getElementById("update_bridge").onclick = () => {
    let class_ = parseFloat(document.getElementById("class").value);
    let spand = parseFloat(document.getElementById("spand").value);
    let name = document.getElementById("name").value;
    if (name == "" || class_ == NaN || spand == NaN) {
      return alert("Please specify bridge data");
    }
    let old_path = JSON.parse(localStorage.getItem("oldbridge")).raw.path;
    console.log(old_path);
    let body = {
      bridge: {
        class: class_,
        spand: spand,
        name: name,
        path: old_path,
      },
      oldbridge: JSON.parse(localStorage.getItem("oldbridge")),
    }
    FetchRetry("/update/bridge", 1000, 10,  {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
        },
      body: JSON.stringify(body)
    }, (data) => {
      localStorage.setItem("oldbridge", JSON.stringify(null));
      console.log(data)
      location.reload();

    })
  }

}