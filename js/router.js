define([
    'backbone',
    'views/headerView',
    'views/footerView',
    'views/homeView',
    'views/regionsView',
    'views/speciesView',
    'views/tnmView',
    'views/dataView',
    'views/region/regionView',
    'views/spikeView',
    'models/regionModel'

], function (Backbone,
             HeaderView, FooterView, HomeView, RegionsView, SpeciesView, TnmView, DataView, RegionView, SpikeView,
             RegionModel) {

    var Router = Backbone.Router.extend({
        routes: {
            // App URL routes
            "": "home",
            "regions": "regions",
            "species": "species",
            "tnm": "tnm",
            "data": "data",
            'spike(/:region)': 'spike',

            "region/:id/summary/:data": 'region_summary',
            "region/:id/species/:species/details/:type": 'region_details'


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

        router.on('route:region_summary', function (region, data) {
            console.log('Summary of', region, 'for', data);
        });

        router.on('route:region_details', function (region, species, type) {
            console.log('Details of', region, 'species', species, 'type', type);
        });

        router.on('route:spike', function (region) {
            new SpikeView().render();
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