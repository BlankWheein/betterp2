let map;
let directionsRenderer;
let directionsService;

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
  initTable();
}

function initTable() {
    var tbody = document.getElementById('tbody');
    FetchRetry("/get/routes", 5000, 10, {}, (data) => {
        console.log(data);
        let counter = 0;
        data.routes.review.forEach(element => {
            console.log(element);

            let tr = document.createElement("tr");
            let index = document.createElement("td");
            let date = document.createElement("td");
            let uuid = document.createElement("td");
            index.textContent = counter + "";
            uuid.textContent = element.uuid;
            date.textContent = element.date;

            tr.appendChild(index);
            tr.appendChild(uuid);
            tr.appendChild(date);

            tbody.appendChild(tr);
            counter += 1;
        });
    highlight_row();

    })
}

function on_cell_click() {
    var table = document.getElementById('display-table');
    var rowId = this.parentNode.rowIndex;
    var rowsNotSelected = table.getElementsByTagName('tr');
    for (var row = 0; row < rowsNotSelected.length; row++) {
        rowsNotSelected[row].style.backgroundColor = "";
        rowsNotSelected[row].classList.remove('selected');
    }
    var rowSelected = table.getElementsByTagName('tr')[rowId];
    rowSelected.style.backgroundColor = "pink";
    rowSelected.className += " selected";

    let uuid = rowSelected.cells[1].innerHTML;
    FetchRetry("/get/routes", 5000, 10, {}, (data) => {
        data.routes.review.forEach(element => {
            if (element.uuid == uuid) {
                console.log(element);
                localStorage.setItem("selected_data", JSON.stringify(element));
                directionsService.route(
                    { 
                      origin: element.data.waypoints.origin,
                      destination: element.data.waypoints.destination,
                      waypoints: element.data.waypoints.waypoint,
                      travelMode: google.maps.TravelMode.DRIVING,
                      avoidTolls: true,
                      optimizeWaypoints: false,
                    },
                    (result, status) => {
                      if (status === "OK") {
                        directionsRenderer.setDirections(result);
                        console.log(result);
                      } else {
                        alert("Could not display directions due to: " + status);
                      }
                    }
                  );
            }
        });
    highlight_row();

    })
}

function approve() {
    console.log("clicked")
    let data = JSON.parse(localStorage.getItem("selected_data"));
    FetchRetry(`/approve/${data.uuid}`, 2500, 10, {}, (data) => {
        console.log(data);
    })
}

function reject() {
    console.log("clicked")
    let reason = document.getElementById("reason");
    let data = JSON.parse(localStorage.getItem("selected_data"));
    FetchRetry(`/reject/${data.uuid}`, 2500, 10, {}, (data) => {
        console.log(data);
    })
}

function highlight_row() {
    document.getElementById("approve_button").onclick = approve;
    document.getElementById("reject_button").onclick = reject;
    var table = document.getElementById('display-table');
    var cells = table.getElementsByTagName('td');

    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        cell.onclick = on_cell_click; 
    }

}