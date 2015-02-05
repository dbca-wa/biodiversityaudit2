// Define shortcut alias
require.config({
    paths: {
        jquery: 'lib/jquery.min',
        underscore: 'lib/lodash.min',
        backbone: 'lib/backbone-min',
        leaflet: 'lib/leaflet',
        templates: '../templates'
    }
});

require(['app'], function (App) {
    App.initialize();
});