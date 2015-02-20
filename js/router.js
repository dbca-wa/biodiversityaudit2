define([
    'backbone',
    'views/headerView',
    'views/footerView',
    'views/homeView',
    'views/regionsView',
    'views/speciesView',
    'views/tnmView',
    'views/dataView',
    'views/spikeView',
    'models/regionModel'

], function (Backbone,
             HeaderView, FooterView, HomeView, RegionsView, SpeciesView, TnmView, DataView, SpikeView,
             RegionModel) {

    var Router = Backbone.Router.extend({
        routes: {
            // App URL routes
            "": "home",
            "regions": "regions",
            "species": "species",
            "tnm": "tnm",
            "data": "data",
            'spike': 'spike',

//            "region/:id/fauna": 'region_fauna',

//            // Default
//            "*actions": "defaultRoute"

        }
    });

    function initialize() {
        var router = new Router();


        new HeaderView();
        new FooterView();


        router.on('route:home', function () {
            new HomeView().render();
        });

        router.on('route:regions', function () {
            new RegionsView().render();
        });

        router.on('route:species', function () {
            new SpeciesView().render();
        });

        router.on('route:tnm', function () {
            new TnmView().render();
        });

        router.on('route:data', function () {
            new DataView().render();
        });

        router.on('route:spike', function () {
            var model = new RegionModel({'SUB_CODE': 'AVW02'});
            new SpikeView({model: model}).render();
        });

        router.on('route:defaultRoute', function () {
            new HomeView().render();
        });


        Backbone.history.start();
    }


    return {
        initialize: initialize
    };
});