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
        console.log(data);
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
function loadVerticalMenu() {
  let menu = document.getElementById("vertical-menu");
  let links = [{href:"/", name:"Home"}, {href:"TruckInput.html", name:"Input Truck and classification data"},
              {href:"map.html", name:"Map"}, {href: "review.html", name:"Review"}, {href: "roadwork.html", name:"Road Work"}];
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