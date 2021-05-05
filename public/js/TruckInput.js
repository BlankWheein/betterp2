function start() {
    var bridgeClassification = document.getElementById("bridgeClassification")
    var roadClassification = document.getElementById("roadClassification")
    var height = document.getElementById("height")
    var width = document.getElementById("width")
    var length = document.getElementById("length")
    var save_input = document.getElementById("save_input")

    var maxclass2 = document.getElementById("maxclass2")
    var maxclass4 = document.getElementById("maxclass4")
    var maxclass8 = document.getElementById("maxclass8")
    var maxclass10 = document.getElementById("maxclass10")
    var maxclass15 = document.getElementById("maxclass15")
    var maxclass20 = document.getElementById("maxclass20")
    var maxclass25 = document.getElementById("maxclass25")
    var maxclass30 = document.getElementById("maxclass30")
    var maxclass40 = document.getElementById("maxclass40")
    var maxclass50 = document.getElementById("maxclass50")
    var maxclass60 = document.getElementById("maxclass60")
    var maxclass80 = document.getElementById("maxclass80")
    var maxclass100 = document.getElementById("maxclass100")
    var maxclass200 = document.getElementById("maxclass200")

    
    
    save_input.onclick = function () {
        var span = {
            "span2": maxclass2.value,
            "span4": maxclass4.value,
            "span8": maxclass8.value,
            "span10": maxclass10.value,
            "span15": maxclass15.value,
            "span20": maxclass20.value,
            "span25": maxclass25.value,
            "span30": maxclass30.value,
            "span40": maxclass40.value,
            "span50": maxclass50.value,
            "span60": maxclass60.value,
            "span80": maxclass80.value,
            "span100": maxclass100.value,
            "span200": maxclass200.value
        };
    
        localStorage.setItem("BridgeClassification", bridgeClassification.value);
        localStorage.setItem("RoadClassification", roadClassification.value);
        localStorage.setItem("Height", height.value);
        localStorage.setItem("Width", width.value);
        localStorage.setItem("Length", length.value);
        localStorage.setItem("Span", JSON.stringify(span));
        
    }

    var bridgeClassification_storage = localStorage.getItem("BridgeClassification");
    var roadClassification_storage = localStorage.getItem("RoadClassification");
    var height_storage = localStorage.getItem("Height");
    var width_storage = localStorage.getItem("Width");
    var length_storage = localStorage.getItem("Length");
    var span_storage = JSON.parse(localStorage.getItem("Span"));
        
    if (bridgeClassification_storage > 0 || roadClassification_storage > 0) {
        bridgeClassification.value = bridgeClassification_storage;
        roadClassification.value = roadClassification_storage;
        height.value = height_storage;
        width.value = width_storage;
        length.value = length_storage;
        span = span_storage;

        maxclass2.value = span.span2;
        maxclass4.value = span.span4;
        maxclass8.value = span.span8;
        maxclass10.value = span.span10;
        maxclass15.value = span.span15;
        maxclass20.value = span.span20;
        maxclass25.value = span.span25;
        maxclass30.value = span.span30;
        maxclass40.value = span.span40;
        maxclass50.value = span.span50;
        maxclass60.value = span.span60;
        maxclass80.value = span.span80;
        maxclass100.value = span.span100;
        maxclass200.value = span.span200;
    }
}
