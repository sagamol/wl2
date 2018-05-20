/*
    Vorbereitung: GPX Track herunterladen und nach GeoJSON konvertieren
    -------------------------------------------------------------------
    Datenquelle https://www.data.gv.at/suche/?search-term=bike+trail+tirol&searchIn=catalog
    Download Einzeletappen / Zur Ressource ...
    Alle Dateien im unterverzeichnis data/ ablegen
    Die .gpx Datei der eigenen Etappe als etappe00.gpx speichern
    Die .gpx Datei über https://mapbox.github.io/togeojson/ in .geojson umwandeln und als etappe00.geojson speichern
    Die etappe00.geojson Datei in ein Javascript Objekt umwandeln und als etappe00.geojson.js speichern

    -> statt 00 natürlich die eigene Etappe (z.B. 01,02, ...25)
*/

// eine neue Leaflet Karte definieren
//let myMap = L.map("map");
let myMap = L.map("map", {
    fullscreenControl: true,
});
// Layer für Etappe12 und Start- Zielmarker hinzufügen
let etappe12group = L.featureGroup().addTo(myMap);
let overlayMarker = L.featureGroup().addTo(myMap);

// Grundkartenlayer mit OSM, basemap.at, Elektronische Karte Tirol (Sommer, Winter, Orthophoto jeweils mit Beschriftung)
const myLayers = {
    osm: L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            subdomains: ["a","b","c"],
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
    ),
    geolandbasemap: L.tileLayer(
        "https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: "Datenquelle: <a href='https://www.basemap.at'>basemap.at</a>",
    }
    ),
    bmapoverlay: L.tileLayer(
        "https://{s}.wien.gv.at/basemap/bmapoverlay/normal/google3857/{z}/{y}/{x}.png", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: "Datenquelle: <a href='https://www.basemap.at'>basemap.at</a>",
    }
    ),
   // eKarte_Tirol_Sommer: L.tileLayer(
     //   "http://wmts.kartetirol.at/wmts/gdi_base_summer/GoogleMapsCompatible/{z}/{x}/{y}.jpeg80", {
       // attribution: "Datenquelle: <a href='https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol'>eKarte Tirol</a>",
   // }
   // ),
   // eKarte_Tirol_Winter: L.tileLayer(
   //     "http://wmts.kartetirol.at/wmts/gdi_base_winter/GoogleMapsCompatible/{z}/{x}/{y}.jpeg80", {
   //     attribution: "Datenquelle: <a href='https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol'>eKarte Tirol</a>",
   // }
   // ),
   // eKarte_Tirol_Ortho: L.tileLayer(
    //    "http://wmts.kartetirol.at/wmts/gdi_ortho/GoogleMapsCompatible/{z}/{x}/{y}.jpeg80", {
    //    attribution: "Datenquelle: <a href='https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol'>eKarte Tirol</a>",
    //}
    //),
    bmapgrau: L.tileLayer(
        "https://{s}.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: "Datenquelle: <a href='https://www.basemap.at'>basemap.at</a>",
    }
    ),
    //gdi_nomenklatur: L.tileLayer(
    //    "http://wmts.kartetirol.at/wmts/gdi_nomenklatur/GoogleMapsCompatible/{z}/{x}/{y}.png8", {
    //        attribution: "Datenquelle: <a href='https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol'>eKarte Tirol</a>",
    //        pane: "overlayPane",
    //}
    //),
    bmaphidpi: L.tileLayer(
        "https://{s}.wien.gv.at/basemap/bmaphidpi/normal/google3857/{z}/{y}/{x}.jpeg", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: "Datenquelle: <a href='https://www.basemap.at'>basemap.at</a>",
    }
    ),
    bmaporthofoto30cm: L.tileLayer(
        "https://{s}.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: "Datenquelle: <a href='https://www.basemap.at'>basemap.at</a>",
    }
    ),
}

// Layergruppen für die Elektronische Karte Tirol definieren
//const tirisSommer = L.layerGroup([
  //  myLayers.eKarte_Tirol_Sommer,
  //  myLayers.gdi_nomenklatur
//]);
//const tirisWinter = L.layerGroup([
  //  myLayers.eKarte_Tirol_Winter,
  //  myLayers.gdi_nomenklatur
//]);
//const tirisOrtho = L.layerGroup([
  //  myLayers.eKarte_Tirol_Ortho,
  //  myLayers.gdi_nomenklatur
//]);

// Baselayer control für OSM, basemap.at, Elektronische Karte Tirol hinzufügen
let myMapControl = L.control.layers({
    "Openstreetmap": myLayers.osm,
    "basemap.at Grundkarte": myLayers.geolandbasemap,
    "basemap.at grau": myLayers.bmapgrau,
    "basemap.at highdpi": myLayers.bmaphidpi,
    "basemap.at Orthofoto": myLayers.bmaporthofoto30cm,
   // "Elektronische Karte Tirol - Sommer": tirisSommer,
   // "Elektronische Karte Tirol - Winter": tirisWinter,
   // "Elektronische Karte Tirol - Orthophoto": tirisOrtho,
}, {
        "Rheindeltarunde": etappe12group,
        "Start / Ziel": overlayMarker,
    });

myMap.addControl(myMapControl);
myMap.addLayer(myLayers.geolandbasemap);
myMap.setView([47.442016, 9.657747],10);

let gpxTrack = new L.GPX("data/rheindeltarunde.gpx", {
    async : true,
}).addTo(etappe12group);
gpxTrack.on("loaded", function(evt) {
    console.log("get_distance",evt.target.get_distance().toFixed(0))
    console.log("get_elevation_min",evt.target.get_elevation_min().toFixed(0))
    console.log("get_elevation_max",evt.target.get_elevation_max().toFixed(0))
    console.log("get_elevation_gain",evt.target.get_elevation_gain().toFixed(0))
    console.log("get_elevation_loss",evt.target.get_elevation_loss().toFixed(0))
    let laenge = evt.target.get_distance().toFixed(0);
    document.getElementById("laenge").innerHTML = laenge;
    let tiefster_Punkt = evt.target.get_elevation_min().toFixed(0);
    document.getElementById("tiefster_Punkt").innerHTML = tiefster_Punkt;
    let hoechster_Punkt = evt.target.get_elevation_max().toFixed(0);
    document.getElementById("hoechster_Punkt").innerHTML = hoechster_Punkt;
    let aufstieg = evt.target.get_elevation_gain().toFixed(0);
    document.getElementById("aufstieg").innerHTML = aufstieg;
    let abstieg = evt.target.get_elevation_loss().toFixed(0);
    document.getElementById("abstieg").innerHTML = abstieg;

    myMap.fitBounds(evt.target.getBounds());
});

// Maßstabsleiste metrisch
L.control.scale({           
    maxWidth : 200,        
    metric : true,          
    imperial : false,      
    position : "bottomleft" 
}).addTo(myMap);

// Start- und Endpunkte der Route als Marker mit Popup, Namen, Wikipedia Link und passenden Icons für Start/Ziel von https://mapicons.mapsmarker.com/
L.marker([47.495722,9.627565],{
    icon : L.icon({
        iconUrl : 'images/start.png',
        iconAnchor : [16,37],
        popupAnchor : [0,-37],
    })
}).bindPopup(
    '<h3>Höchst Rohrspitz</h3><img src="images/Bodensee_Glashaus.jpg"/>'
).addTo(overlayMarker);

L.marker([47.500863,9.565542],{
    icon : L.icon({
        iconUrl : 'images/finish.png',
        iconAnchor : [16,37],
        popupAnchor : [0,-37],
    })
}).bindPopup(
    '<h3>Rheinholz</h3><img src="images/Rheinholz.jpg"/>'
).addTo(overlayMarker);

// GeoJSON Track als Linie in der Karte einzeichnen und auf Ausschnitt zoomen
//let geojsonTrack = L.geoJSON(etappe12data).addTo(etappe12group);
