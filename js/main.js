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
        faunaModel: 'models/fauna',
        flora: 'models/flora',
        communities: 'models/communities',
        wetlands: 'models/wetlands'
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

require(['router', 'config',
        'faunaModel', 'flora', 'communities', 'wetlands'

    ],
    function (Router, config, faunaModel, flora, communities, wetlands) {
        var dataSource = config.datasource || 'csv'; // 'csv', 'datastore', 'test'

        Router.initialize();

        // start the data fetching
        faunaModel.init(faunaModel.dataSets[dataSource]);
//        flora.init(flora.dataSets[dataSource]);
//        communities.init(communities.dataSets[dataSource]);
//        wetlands.init(wetlands.dataSets[dataSource]);


        // @todo: remove when prod
        window.faunaModel = faunaModel;
        window.config = config;
    });