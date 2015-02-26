define([
    'jquery',
    'underscore',
    'leaflet',
    'leaflet_ajax',
    'config'
], function ($, _, L, ajax, config) {

    var ControlButton = L.Control.extend({
        options: {
            position: 'topleft'
        },
        initialize: function (options) {
            this._button = {};
            this.setButton(options);
        },

        onAdd: function (map) {
            this._map = map;
            var container = L.DomUtil.create('div', 'leaflet-control-button');

            this._container = container;

            this._update();
            return this._container;
        },

        onRemove: function (map) {
        },

        setButton: function (options) {
            var button = {
                'text': options.text,                 //string
                'iconUrl': options.iconUrl,           //string
                'onClick': options.onClick,           //callback function
                'hideText': !!options.hideText,         //forced bool
                'maxWidth': options.maxWidth || 70,     //number
                'doToggle': options.toggle,			//bool
                'toggleStatus': false					//bool
            };

            this._button = button;
            this._update();
        },

        getText: function () {
            return this._button.text;
        },

        getIconUrl: function () {
            return this._button.iconUrl;
        },

        destroy: function () {
            this._button = {};
            this._update();
        },

        toggle: function (e) {
            if (typeof e === 'boolean') {
                this._button.toggleStatus = e;
            }
            else {
                this._button.toggleStatus = !this._button.toggleStatus;
            }
            this._update();
        },

        _update: function () {
            if (!this._map) {
                return;
            }

            this._container.innerHTML = '';
            this._makeButton(this._button);

        },

        _makeButton: function (button) {
            var newButton = L.DomUtil.create('div', 'leaflet-buttons-control-button', this._container);
            if (button.toggleStatus)
                L.DomUtil.addClass(newButton, 'leaflet-buttons-control-toggleon');

//            var image = L.DomUtil.create('img', 'leaflet-buttons-control-img', newButton);
//            image.setAttribute('src', button.iconUrl);

            if (button.text !== '') {

                L.DomUtil.create('br', '', newButton);  //there must be a better way

                var span = L.DomUtil.create('span', 'leaflet-buttons-control-text', newButton);
                var text = document.createTextNode(button.text);  //is there an L.DomUtil for this?
                span.appendChild(text);
                if (button.hideText)
                    L.DomUtil.addClass(span, 'leaflet-buttons-control-text-hide');
            }

            L.DomEvent
                .addListener(newButton, 'click', L.DomEvent.stop)
                .addListener(newButton, 'click', button.onClick, this)
                .addListener(newButton, 'click', this._clicked, this);
            L.DomEvent.disableClickPropagation(newButton);
            return newButton;

        },

        _clicked: function () {  //'this' refers to button
            if (this._button.doToggle) {
                if (this._button.toggleStatus) {	//currently true, remove class
                    L.DomUtil.removeClass(this._container.childNodes[0], 'leaflet-buttons-control-toggleon');
                }
                else {
                    L.DomUtil.addClass(this._container.childNodes[0], 'leaflet-buttons-control-toggleon');
                }
                this.toggle();
            }
        }

    });

    function addWAControl(map, callback) {
        var Controller = L.Control.extend({
            options: {
                position: 'topleft',
                title: 'Click to display a state profile'
            }
        });
        var myButtonOptions = {
            'text': 'Western Australia',  // string
            'iconUrl': 'images/myButton.png',  // string
            'onClick': callback,  // callback function
            'hideText': true,  // bool
            'maxWidth': 30,  // number
            'doToggle': false,  // bool
            'toggleStatus': false  // bool
        };
        var myButton = new ControlButton(myButtonOptions).addTo(map);
    }


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

        addWAControl(map, function () {
            onclick({REG_NAME: 'State Level', SUB_CODE: 'Western Australia'});
        });
        return map;
    }

    return {
        init_map: initMap
    };
});