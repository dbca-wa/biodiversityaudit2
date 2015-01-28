var map = L.map('map').setView([-25, 120], 5);

/* Background layer */
var osm = L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap' +
  '</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">' +
  'CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'examples.map-i875mjb7'
}).addTo(map);

/* Styles for GeoJSON layes */
var marine_style = {"color": "#0066ff", "weight": 2, "opacity": 0.8};
var terrestrial_style = {"color": "#ff9933", "weight": 2, "opacity": 0.8};

/* GeoJSON layer: IBRA */
var ibra_url = "http://internal-data.dpaw.wa.gov.au/dataset/" + 
                "10b54e2b-7226-4dfb-b3ef-30264cd0670a/resource/" + 
                "d32d65a1-7ebe-4457-a208-03fd9f1a456f/download/ibra7.geojson"

var ibra = new L.GeoJSON.AJAX(ibra_url, {
    style: terrestrial_style,
    onEachFeature: function (feature, layer) {layer.bindPopup(feature.properties.popup);}
    }).addTo(map);


/* GeoJSON layer: MPA */
var mpa_url = "http://internal-data.dpaw.wa.gov.au/dataset/" + 
                "0988fd6e-ee4f-47f1-8081-933b71219b51/resource/" + 
                "9e8e00b6-3e07-4291-8f89-49b95cc3237e/download/cpr.json"

var mpa = new L.GeoJSON.AJAX(mpa_url, {
    style: marine_style,
    onEachFeature: function (feature, layer) {layer.bindPopup(feature.properties.assets);}
    }); //.addTo(map);
    
/* Layer controls */
var basemaps = {"OpenStreetMap": osm};
var overlays = {"Terrestrial assets": ibra, "Marine assets": mpa};
var controls = L.control.layers(basemaps, overlays).addTo(map);
