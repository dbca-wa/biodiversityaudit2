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
        floraModel: 'models/flora',
        communitiesModel: 'models/communities',
        wetlandsModel: 'models/wetlands'
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
        'faunaModel', 'floraModel', 'communitiesModel', 'wetlandsModel'

    ],
    function (Router, config, faunaModel, floraModel, communitiesModel, wetlandsModel) {
        var dataSource = config.datasource || 'csv'; // 'csv', 'datastore', 'test'

        Router.initialize();

        // start the data fetching
        faunaModel.init(faunaModel.dataSets[dataSource]);
//        floraModel.init(floraModel.dataSets[dataSource]);
        communitiesModel.init(communitiesModel.dataSets[dataSource]);
//        wetlandsModel.init(wetlandsModel.dataSets[dataSource]);


        // @todo: remove when prod
        window.faunaModel = faunaModel;
        window.config = config;
    });