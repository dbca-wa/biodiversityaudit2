define([
    'backbone',
    'views/headerView',
    'views/footerView',
    'views/homeView',
    'views/regionsView',
    'views/assetsView',
    'views/tnmView',
    'views/dataView',
    'views/region/regionView',
    'views/aboutView',

], function (Backbone, HeaderView, FooterView, HomeView, RegionsView, AssetsView, TnmView, DataView, RegionView, AboutView) {

    var Router = Backbone.Router.extend({
        routes: {
            // App URL routes
            "": "home",
            "regions": "regions",
            "assets": "assets",
            "tnm": "tnm",
            "data": "data",
            "about": "about"

            // Default
            // important: don't put default rules. It will interfere with the links in the tables (details)
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

        router.on('route:assets', function () {
            new AssetsView().render();
        });

        router.on('route:tnm', function () {
            new TnmView().render();
        });

        router.on('route:data', function () {
            new DataView().render();
        });

        router.on('route:about', function () {
            new AboutView().render();
        });

        Backbone.history.start();
    }


    return {
        initialize: initialize
    };
});