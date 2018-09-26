// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data.features);
  createFeatures(data.features);
});
// Function to determine marker size based on population
function markerSize(mag) {
  return mag * 14000;
}

function colorf(c) {
  return c > 5 ? '#F30' :
    c > 4 ? '#F60' :
    c > 3 ? '#F90' :
    c > 2 ? '#FC0' :
    c > 1 ? '#FF0' :
             '#9F3';

}
function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  function pointToLayer(feature,latlng){
      var circle2=L.circle(latlng,{
      radius:markerSize(feature.properties.mag),
      fillColor:colorf(feature.properties.mag),
      fillOpacity:.7,
      stroke:true,
      color:"black",
      weight:.5
      
      });
      return circle2;
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer
  });
// console.log(earthquakes);
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };


  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });



  // Create legend
// legend.onAdd = function () {
//   var div = L.DomUtil.create("div", "info legend");

//   var grades = [0, 1, 2, 3, 4, 5];
//   var colors = [
//     //add hex colors here
//   ]

var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend');
    var cgrades = [0, 1, 2, 3, 4, 5];
    var colors = ['#9F3', '#FF0', '#FC0', '#F90', '#F60','#F30'];
    // div.innerHTML += 'Magnitude<br><hr>'
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < cgrades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + colors[i] + '"></i> ' +
        cgrades[i] + (cgrades[i + 1] ? '&ndash;' + cgrades[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(myMap);
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}



// legend.onAdd = function () {
//   var div = L.DomUtil.create("div", "info legend");

//   var grades = [0, 1, 2, 3, 4, 5];
//   var colors = [
//     //add hex colors here
//   ]