// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
let API_KEY = "pk.eyJ1Ijoic2thcmE2IiwiYSI6ImNqc3dsbG1rbDBpenU0YW9kMWt1MmI5bDQifQ.F1h-PDbV0c3bAQ79caD_vw";
console.log("test");

  
// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
var street =L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 20,
  id: "mapbox.streets",
  accessToken: API_KEY
}); 

var dark =L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 20,
  id: "mapbox.dark",
  accessToken: API_KEY
});

function chooseColor(magnitude) {
  if (magnitude < 1) {
      return "#ffffcc"
  }
  else if (magnitude < 2) {
      return "#ffeda0"
  }
  else if (magnitude < 3) {
      return "#fed976"
  }
  else if (magnitude < 4) {
      return "#feb24c"
  }
  else if (magnitude < 5) {
      return "#fd8d3c"
  }
  else if (magnitude < 6) {
      return "#fc4e2a"
  }
  else if (magnitude < 7) {
      return "#e31a1c"
  }
  else {
      return "#b10026"
  };
};

function buildMap (data, plates) 
{
  var earthquakes = L.geoJSON(data);
  var faultlines =L.geoJSON (plates);


  var bglayer = {
  "Street View": street,
  "Dark View" : dark

  };

  var overlayLayers = {
  "Earthquakes 1": earthquakes,
  "Faultlines" : faultlines
  };



  var myMap = L.map(`map`, {
  'layers':[street, faultlines, earthquakes]
  }).setView ([40,-30], 3);
  L.control.layers(bglayer,overlayLayers).addTo(myMap);

  
  // Legend
  var legend = L.control({position: 'bottomleft'});
  legend.onAdd = function(map) {
      var div = L.DomUtil.create('div', 'info legend')
              
      div.innerHTML = `<i style = "background:darkred"></i><p>Legend 1 </p>,
                      <i style = "background:darkred"></i><p><Legend 2 </p>`
                  
          
   return div;
      };

  legend.addTo(myMap);
};

d3.json('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json')
       .then (plates=>{
                d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
                .then(data => buildMap(data, plates));
       });

  
