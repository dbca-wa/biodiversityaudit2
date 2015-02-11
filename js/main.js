require.config({
    // Define shortcut alias
    paths: {
        jquery: 'lib/jquery.min',
        underscore: 'lib/lodash.min',
        backbone: 'lib/backbone-min',
        leaflet: 'lib/leaflet',
        leaflet_ajax: 'lib/leaflet.ajax.min',
        datatables: 'lib/jquery.dataTables',
        recline: 'lib/recline',
        bootstrap: 'lib/bootstrap.min',
        templates: '../templates',
        config: 'app/config'
    },

    // Dependencies and return values for scripts that are not AMD friendly
    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        recline: {
            deps: ['jquery', 'underscore', 'backbone'],
            init: function () {
                return this.recline;
            }
        },
        leaflet_ajax: {
            deps: ['leaflet']
        }
    }
});

require(['router'], function (Router) {
    Router.initialize();
});