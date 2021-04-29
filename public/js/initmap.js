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
      if (localStorage.getItem("submitEnabled") == "false") {return;} else {
      localStorage.setItem("submitEnabled", "false");
      var test = {
        arr: []
      }
      directionsRenderer.getDirections().routes[0].overview_path.forEach(element => {
        test.arr.push({lat: element.lat(),
                       lng: element.lng()});
      });
      console.log(test);
      
      
    }
    });
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      draggable: false,
      map,
      panel: undefined,
    });
    init(directionsService, directionsRenderer)

    directionsRenderer.addListener("directions_changed", () => {
      console.log(map);
      computeTotalDistance(directionsRenderer.getDirections(), objects);
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
  
  objects = [];
  let bropath = [{lat:57.05272529190218, lng:9.917737176668847},{lat:57.05306372385469, lng:9.91805635954162},{lat:57.05367561776083, lng:9.918718205955694},{lat:57.05426836837738, lng:9.919378057667764},{lat:57.05497387331946, lng:9.920146049659246},{lat:57.0556299277329, lng:9.920869682025995},{lat:57.056316531824514, lng:9.921638492076896},{lat:57.05706403241996, lng:9.922431227192247},{lat:57.05709466289421, lng:9.922326621040666},{lat:57.0558358074135, lng:9.920956413417903},{lat:57.05492524059234, lng:9.919964157210103},{lat:57.053941462138795, lng:9.918878477577667},{lat:57.05323843425168, lng:9.918116804227157},{lat:57.05299336429895, lng:9.917867358788772},{lat:57.05276725665803, lng:9.917639371022506},];
  let tunnelpath = [{lat:57.0534562160397, lng:9.964558263488325},{lat:57.05436645636499, lng:9.962648530669721},{lat:57.05558591003367, lng:9.960309644408735},{lat:57.05661862177167, lng:9.958314080901655},{lat:57.057779658859445, lng:9.956082483001264},{lat:57.05802469722276, lng:9.955567498870405},{lat:57.057913846734934, lng:9.955331464477094},{lat:57.056421038560934, lng:9.958161943770762},{lat:57.05516076960027, lng:9.960597389556284},{lat:57.05444309732675, lng:9.96194922289979},{lat:57.05426228734889, lng:9.962400229337906},{lat:57.053958189182566, lng:9.962887458218788},{lat:57.05371895888467, lng:9.963354162587379},{lat:57.05326383357485, lng:9.964121274365638},];
  objects.push(createPolygon("limfjordsboren", bropath, 50, "Bro"));
  objects.push(createPolygon("limfjordstunnel", tunnelpath, 100, "Tunnel"));

  objects.forEach(e => {
    e.setMap(map);
  });
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

  function createPolygon(name, path, class_, type=undefined, color="#ffcc33", geodesic=false, strokeWeight=2, strokeOpacity=1.0) {
    let polygon = new google.maps.Polygon({
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