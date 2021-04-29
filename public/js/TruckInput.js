function start() {
    var bridgeClassification = document.getElementById("bridgeClassification")
    var roadClassification = document.getElementById("roadClassification")
    var height = document.getElementById("height")
    var width = document.getElementById("width")
    var length = document.getElementById("length")
    var save_input = document.getElementById("save_input")

    save_input.onclick = function () {
        localStorage.setItem("BridgeClassification", bridgeClassification.value);
        localStorage.setItem("RoadClassification", roadClassification.value);
        localStorage.setItem("Height", height.value);
        localStorage.setItem("Width", width.value);
        localStorage.setItem("Length", length.value);
    }

    var bridgeClassification_storage = localStorage.getItem("BridgeClassification");
    var roadClassification_storage = localStorage.getItem("RoadClassification");
    var height_storage = localStorage.getItem("Height");
    var width_storage = localStorage.getItem("Width");
    var length_storage = localStorage.getItem("Length");
        
    if (bridgeClassification_storage > 0 || roadClassification_storage > 0) {
        bridgeClassification.value = bridgeClassification_storage;
        roadClassification.value = roadClassification_storage;
        height.value = height_storage;
        width.value = width_storage;
        length.value = length_storage;
    }
}
