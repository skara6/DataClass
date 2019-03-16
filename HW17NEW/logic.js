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
  function pickColor(mag){
    if(mag>5) return 'lightgreen';
    else if(mag>4) return 'yellow';
    else if(mag>3) return 'pink';
    else if(mag>2) return 'gold';
    else if(mag>1) return 'orange';
    else if(mag>1) return 'red';
    }
  function makecircles(feature,latlong){
    var mag=feature.properties.mag;
    var radius=mag*50000;
    var color=pickColor(mag);
    var style={radius:radius, fillColor: color, opacity:0,fillOpacity:0.75};
    return L.circle(latlong,style).bindPopup(`${feature.properties.place} Magnitude: ${mag}`);
  }
  

  
  
  var earthquakes = L.geoJSON(data,{'pointToLayer':makecircles});
  var faultlines =L.geoJSON (plates,{'style':{'fillOpacity':0,color:'yellow'}});


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
              
      div.innerHTML = `<p><i style="background: lightgreen"></i>0-1 </p>
      <p><i style="background:  yellow"></i>1-2</p>
      <p><i style="background:  pink"></i>2-3</p>
      <p><i style="background:  gold"></i>3-4</p>
      <p><i style="background:  orange"></i>4-5</p>
      <p><i style="background:  red"></i>5+</p>`
   return div;
      };

  legend.addTo(myMap);
};

d3.json('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json')
       .then (plates=>{
                d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
                .then(data => buildMap(data, plates));
       });

  
