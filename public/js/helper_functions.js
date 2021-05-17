function wait(delay){
    return new Promise((resolve) => setTimeout(resolve, delay));
}

function FetchRetry(url, delay, tries, fetchOptions = {}, callback) {
    function onError(err){
        triesLeft = tries - 1;
        console.log(`tries left ${triesLeft}`)
        if(!triesLeft){
            throw err;
        }
        return wait(delay).then(() => FetchRetry(url, delay, triesLeft, fetchOptions, callback));
    }
    return fetch(url, fetchOptions).then(data => data.json()).then(data => {
      if (data.status == 1) {
        throw new Error("Route is still under review");
      }
      callback(data);
    }).catch(onError);
}

function createPolygon(data) {

  if (data.name === undefined) {data.name = "Not Specified";}
  if (data.path === undefined) {data.path = [];}
  if (data.class === undefined) {data.class = 0;}
  if (data.type === undefined) {data.type = "Not defined";}
  if (data.color === undefined) {data.color = "#ffcc33";}
  if (data.geodesic === undefined) {data.geodesic = false;}
  if (data.strokeWeight === undefined) {data.strokeWeight = 2;}
  if (data.strokeOpacity === undefined) {data.strokeOpacity = 1.0;}
  if (data.spand === undefined) {data.spand = null;}

  let polygon = new google.maps.Polygon({
      path: data.path,
      geodesic: data.geodesic,
      strokeColor: data.color,
      strokeOpacity: data.strokeOpacity,
      strokeWeight: data.strokeWeight,
      data: {
          Name: data.name,
          class: data.class,
          type: data.type,
          spand: data.spand,
          raw: data,
      }
    })
    return polygon;
}
function getHexCodeFromClass(c) {
  if (c == 0) {
    return "#000000";
  }
  if (c > 0 && c <= 24) {
    return "#ffff33";
  }
  if (c > 24 && c <= 30) {
    return "#333399";
  }
  if (c > 30 && c <= 40) {
    return "#993333";
  }
  if (c > 40 && c <= 50) {
    return "#ffcc33";
  }
  if (c > 50 && c <= 60) {
    return "#993399";
  }
  if (c > 60 && c <= 70) {
    return "#33ccff";
  }
  if (c>70 && c<=80) {
    return "#ff6633";
  }
  if (c>80 && c<=90) {
    return "#66cc99";
  }
  if (c>90 && c <= 100) {
    return "#336633";
  }

}

function drawRoads(map_) {
  FetchRetry("/get/routes", 2500, 10, {}, (data) => { 
    let lines = []
    let lastColor = null;
    let pointColor = null;

    for (let route of data.routes.approved) {
      
      console.log(route);

      path = []
      for (let point of route.data.route) {
        if (data.routes.latlng.hasOwnProperty(`${point.lat} ${point.lng}`)) { 
          path.push(point);
          pointColor = getHexCodeFromClass(data.routes.latlng[`${point.lat} ${point.lng}`].class);
          if (lastColor != pointColor && pointColor != null) {
            let poli = createPolyline({ path: path, color: lastColor, strokeWeight: 4 });
            lines.push(poli);
            path = [point];
          }

        } else {
          let poli = createPolyline({ path: path, color: lastColor, strokeWeight: 4 });
          lines.push(poli);
          path = [point];
        }
        lastColor = pointColor;
      }
      if (path.length > 0) {
        let poli = createPolyline({ path: path, color: lastColor, strokeWeight: 4 });
            lines.push(poli);
      }
    }
    for (let poly of lines) {
      poly.setMap(map_);
    }
  })
}

function loadVerticalMenu() {
  let menu = document.getElementById("vertical-menu");
  let links = [{href:"/", name:"Home"}, {href:"TruckInput.html", name:"Input Truck and classification data"},
              {href:"map.html", name:"Map"}, {href: "review.html", name:"Review"}, {href: "roadwork.html", name:"Road Work"},
            {href:"bridgeadder.html", name:"Bridge Adder"},{href:"bridgeupdater.html", name:"Bridge Updater"}, {href:"heatmap.html", name:"Heatmap"}];
  links.forEach(e => {
    let link = document.createElement("a");
    link.href = e.href;
    link.innerHTML = e.name;
    menu.appendChild(link);
  })
}
function createPolyline(data) {
  if (data.name === undefined) {data.name = "Not Specified";}
  if (data.path === undefined) {data.path = [];}
  if (data.class === undefined) {data.class = 0;}
  if (data.type === undefined) {data.type = "Not defined";}
  if (data.color === undefined) {data.color = "#ffcc33";}
  if (data.geodesic === undefined) {data.geodesic = false;}
  if (data.strokeWeight === undefined) {data.strokeWeight = 2;}
  if (data.strokeOpacity === undefined) {data.strokeOpacity = 1.0;}
  if (data.spand === undefined) {data.spand = null;}
  if (data.map === undefined) {data.map = null;}

  let polyline = new google.maps.Polyline({
      path: data.path,
     
      geodesic: data.geodesic,
      strokeColor: data.color,
      map: map,
      strokeOpacity: data.strokeOpacity,
      strokeWeight: data.strokeWeight,
      data: {
          Name: data.name,
          class: data.class,
          type: data.type,
          spand: data.spand,
          raw: data,
      }
    })
    return polyline;
}