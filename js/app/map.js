define([
    'jquery',
    'underscore',
    'leaflet',
    'leaflet_ajax',
    'config'
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
        // Use the local file in test mode.
        var ibra_url = config.datasource === 'test' ? config.urls.ibra_geojson_test : config.urls.ibra_geojson;
        new L.GeoJSON.AJAX(
            ibra_url, {
            style: {"color": "#ff9933", "weight": 2, "opacity": 0.8},
            onEachFeature: function (feature, layer) {
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