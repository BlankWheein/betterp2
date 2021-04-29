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
  
  objects = [];
  let create = createPolyline("create", [], 0);
  create.createpath = [];
  let bropath = [{lat:57.05272529190218, lng:9.917737176668847},{lat:57.05306372385469, lng:9.91805635954162},{lat:57.05367561776083, lng:9.918718205955694},{lat:57.05426836837738, lng:9.919378057667764},{lat:57.05497387331946, lng:9.920146049659246},{lat:57.0556299277329, lng:9.920869682025995},{lat:57.056316531824514, lng:9.921638492076896},{lat:57.05706403241996, lng:9.922431227192247},{lat:57.05709466289421, lng:9.922326621040666},{lat:57.0558358074135, lng:9.920956413417903},{lat:57.05492524059234, lng:9.919964157210103},{lat:57.053941462138795, lng:9.918878477577667},{lat:57.05323843425168, lng:9.918116804227157},{lat:57.05299336429895, lng:9.917867358788772},{lat:57.05276725665803, lng:9.917639371022506},];
  let tunnelpath = [{lat:57.0534562160397, lng:9.964558263488325},{lat:57.05436645636499, lng:9.962648530669721},{lat:57.05558591003367, lng:9.960309644408735},{lat:57.05661862177167, lng:9.958314080901655},{lat:57.057779658859445, lng:9.956082483001264},{lat:57.05802469722276, lng:9.955567498870405},{lat:57.057913846734934, lng:9.955331464477094},{lat:57.056421038560934, lng:9.958161943770762},{lat:57.05516076960027, lng:9.960597389556284},{lat:57.05444309732675, lng:9.96194922289979},{lat:57.05426228734889, lng:9.962400229337906},{lat:57.053958189182566, lng:9.962887458218788},{lat:57.05371895888467, lng:9.963354162587379},{lat:57.05326383357485, lng:9.964121274365638},];
  let path = [{lat:57.05544579883345, lng:9.903975041804824},{lat:57.05514681441531, lng:9.905450247123605},{lat:57.05506804615529, lng:9.905749313428766},{lat:57.0550658581457, lng:9.905794910982019},{lat:57.05490833269905, lng:9.906202396908421},{lat:57.0546954675668, lng:9.906740566324851},{lat:57.05446767779342, lng:9.907297089740123},{lat:57.054198258333635, lng:9.907990135699384},{lat:57.05408289701644, lng:9.908281572379613},{lat:57.05396182374542, lng:9.90865037611916},{lat:57.05369442660285, lng:9.909855517356604},{lat:57.05349895667151, lng:9.910869392364233},{lat:57.053205094582864, lng:9.912349942866431},{lat:57.05309422970503, lng:9.912961486521827},{lat:57.05307964219649, lng:9.91339063996421},{lat:57.05296294192165, lng:9.91413092965232},{lat:57.05290375839875, lng:9.914983099741374},{lat:57.052941686088765, lng:9.915889686388407},{lat:57.05294460360175, lng:9.916414507356732},{lat:57.05289500584941, lng:9.917047508684247},{lat:57.05286874818898, lng:9.917299636331647},{lat:57.05272559450457, lng:9.91766098900411},{lat:57.052617024723475, lng:9.91757701287682},{lat:57.0527576421172, lng:9.917019574248002},{lat:57.052800784462626, lng:9.916499739673656},{lat:57.05280758994279, lng:9.916007884347549},{lat:57.05278895228356, lng:9.915701039451935},{lat:57.05273381188437, lng:9.915123709948652},{lat:57.0527381881783, lng:9.91454167059242},{lat:57.05284074396665, lng:9.91373520070399},{lat:57.05293594736311, lng:9.913159652912324},{lat:57.05303342134724, lng:9.912908973748976},{lat:57.05323491061624, lng:9.91181360282881},{lat:57.05345266460774, lng:9.910661450598228},{lat:57.05366577996967, lng:9.909559727516303},{lat:57.05393903486595, lng:9.908411682527468},{lat:57.054303483318165, lng:9.907511092196199},{lat:57.054683887628876, lng:9.906554589210662},{lat:57.05497685900949, lng:9.905803982161187},{lat:57.055042499398965, lng:9.905691329382561},{lat:57.055242379333436, lng:9.904774978326806},{lat:57.055405749586164, lng:9.903954222368249},{lat:57.05544513337884, lng:9.903975344764241},];
  let path2 = [{lat:57.05344853644534, lng:9.96459089894618},{lat:57.05259037645439, lng:9.966560902611977},{lat:57.051526956453394, lng:9.96855907694945},{lat:57.05055031168042, lng:9.969842466750842},{lat:57.049680826600685, lng:9.970680446749194},{lat:57.04881715683854, lng:9.97125980389641},{lat:57.04777435833657, lng:9.971698529228354},{lat:57.04680559655934, lng:9.971891648277426},{lat:57.04563115922062, lng:9.97230491504887},{lat:57.04460981455985, lng:9.972916458704265},{lat:57.04452810577375, lng:9.972337101557049},{lat:57.04467401419425, lng:9.97153243885258},{lat:57.04510006350186, lng:9.970931624033245},{lat:57.04654708041747, lng:9.970883663203178},{lat:57.04775170108087, lng:9.970714128430718},{lat:57.04937058798277, lng:9.96957254892699},{lat:57.051025817613485, lng:9.967546674478033},{lat:57.05215105748401, lng:9.965652367374535},{lat:57.05323104605435, lng:9.96396701814596},{lat:57.053452774662006, lng:9.964610748309534},];
  objects.push(createPolygon("limfjordsboren", bropath, 50, "Bro"));
  objects.push(createPolygon("limfjordstunnel", tunnelpath, 100, "Tunnel"));
  objects.push(createPolygon("path", path, 100, "Road"));
  objects.push(createPolygon("path2", path2, 100, "Road"));

  objects.forEach(e => {
    e.setMap(map);
  });
  create.setMap(map);
  document.getElementById("cake").onclick = () => {
    console.log(objects);
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