require.config({
    // Define shortcut alias
    paths: {
        jquery: 'lib/jquery.min',
        underscore: 'lib/lodash.min',
        backbone: 'lib/backbone-min',
        leaflet: 'lib/leaflet',
        dataTable: 'lib/jquery.dataTables',
        recline: 'lib/recline',
        bootstrap: 'lib/bootstrap.min',
        templates: '../templates'
    },

    // Dependencies and return values for scripts that are not AMD friendly
    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        dataTable: {
            deps: ['jquery']
        },
        recline: {
            deps: ['jquery', 'underscore', 'backbone', 'lib/csv'],
            init: function () {
                return this.recline;
            }
        }
    }
});

require(['router'], function (Router) {
    Router.initialize();
});