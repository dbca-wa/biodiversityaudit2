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
        CSVBackend: 'lib/csv',
        CKANBackend: 'lib/ckan',
        bootstrap: 'lib/bootstrap.min',
        templates: '../templates',
        config: 'config',
        dataSources: 'models/dataSources',
    },

    // Dependencies and return values for scripts that are not AMD friendly
    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        CSVBackend:{
            deps: ['jquery', 'underscore']
        },
        CKANBackend:{
            deps: ['jquery', 'underscore']
        },
        recline: {
            deps: ['jquery', 'underscore', 'backbone', 'CSVBackend', 'CKANBackend'],
            init: function () {
                return this.recline;
            }
        },
        leaflet_ajax: {
            deps: ['leaflet']
        }
    }
});

require(['router', 'dataSources',

    ],
    function (Router, dataSources ) {

        Router.initialize();

        // start the data fetching
        dataSources.fetchAll();

        // @todo: remove when prod
        window.sources = dataSources;
    });