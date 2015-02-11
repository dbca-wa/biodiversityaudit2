define([
    'jquery',
    'underscore',
    'leaflet',
    'leaflet_ajax',
    'app/config'
], function ($, _, L, ajax, config) {

    function initMap(id, onclick) {
        var map = L.map(id).setView([-25, 120], 5);

        /* Background layer */
        L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap' +
                '</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">' +
                'CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'examples.map-i875mjb7'
        }).addTo(map);

        // Ibra regions layer
        new L.GeoJSON.AJAX(
            config.urls.ibra_geojson, {
            style: {"color": "#ff9933", "weight": 2, "opacity": 0.8},
            onEachFeature: function (feature, layer) {
//                layer.bindPopup(feature.properties.popup);
                layer.on('click', function (e) {
                    if (typeof onclick === 'function') {
                        onclick(feature.properties);
                    }
                });
            }
        }).addTo(map);

        return map;
    }

    return {
        init_map: initMap
    };
});