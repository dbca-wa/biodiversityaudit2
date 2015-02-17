require.config({
    // Define shortcut alias
    paths: {
        jquery: 'lib/jquery.min',
        underscore: 'lib/lodash.min',
        backbone: 'lib/backbone-min',
        leaflet: 'lib/leaflet',
        leaflet_ajax: 'lib/leaflet.ajax.min',
        datatables: 'lib/jquery.dataTables',
        recline: 'lib/recline.dataset',
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
            deps: ['jquery', 'underscore', 'backbone', 'lib/csv', 'lib/ckan'],
            init: function () {
                return this.recline;
            }
        },
        leaflet_ajax: {
            deps: ['leaflet']
        }
    }
});

require(['router', 'models/fauna'], function (Router, fauna) {
    Router.initialize();

    // start the data download
    fauna.init(fauna.datasetCSV);
    // @todo: remove
    window.fauna = fauna
});